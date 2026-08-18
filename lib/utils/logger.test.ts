import { test } from 'node:test';
import assert from 'node:assert';
import { maskData } from './logger.ts';

test('redacts object keys', () => {
  const result = maskData({ api_key: '12345', password: 'my-password', safe_key: 'safe_value', token: 1234, secret: true });
  assert.strictEqual(result.api_key, '[REDACTED]');
  assert.strictEqual(result.password, '[REDACTED]');
  assert.strictEqual(result.safe_key, 'safe_value');
  assert.strictEqual(result.token, '[REDACTED]');
  assert.strictEqual(result.secret, '[REDACTED]');
});

test('redacts raw JSON string', () => {
  const result = maskData('{"api_key": "12345", "nested": {"secret": "supersecret"}}');
  assert.strictEqual(result, '{"api_key":"[REDACTED]","nested":{"secret":"[REDACTED]"}}');
});

test('ignores matches starting with [ or { in regex', () => {
  const result1 = maskData('api_key=[1,2,3]');
  assert.strictEqual(result1, 'api_key=[1,2,3]');

  const result2 = maskData('api_key={"foo":"bar"}');
  assert.strictEqual(result2, 'api_key={"foo":"bar"}');
});

test('conditionally wraps unquoted primitive replacements in quotes to ensure valid JSON', () => {
  const result = maskData('api_key=12345');
  assert.strictEqual(result, 'api_key="[REDACTED]"');
});

test('handles primitive values', () => {
  assert.strictEqual(maskData(42), 42);
  assert.strictEqual(maskData(true), true);
  assert.strictEqual(maskData(null), null);
  assert.strictEqual(maskData(undefined), undefined);
});

test('handles circular references', () => {
  const obj: any = { name: 'test' };
  obj.self = obj;
  const result = maskData(obj);
  assert.strictEqual(result.name, 'test');
  assert.strictEqual(result.self, '[Circular]');
});

test('handles Error instances', () => {
  const error = new Error('Secret password=password123');
  (error as any).api_key = '12345';
  (error as any).safe_prop = 'safe';

  const result = maskData(error);
  assert.ok(result instanceof Error);
  assert.strictEqual(result.message.includes('password123'), false);
  assert.strictEqual(result.message.includes('[REDACTED]'), true);
  assert.strictEqual((result as any).api_key, '12345');
  assert.strictEqual((result as any).safe_prop, 'safe');
});

test('handles arrays', () => {
  const result = maskData(['safe', { api_key: '12345' }, 42]);
  assert.ok(Array.isArray(result));
  assert.strictEqual(result[0], 'safe');
  assert.strictEqual(result[1].api_key, '[REDACTED]');
  assert.strictEqual(result[2], 42);
});

test('handles non-plain objects', () => {
  const date = new Date();
  const map = new Map();
  const set = new Set();

  assert.strictEqual(maskData(date), date);
  assert.strictEqual(maskData(map), map);
  assert.strictEqual(maskData(set), set);
});

test('handles prefixed keys in string logs', () => {
  const result = maskData('stripe_api_key="sk_live_12345" mystripe_apikey=123 token=abc my_secret_token_123="abc"');
  assert.strictEqual(result, 'stripe_api_key="[REDACTED]" mystripe_apikey="[REDACTED]" token="[REDACTED]" my_secret_token_123="[REDACTED]"');
});

test('handles private keys with valid JSON', () => {
  const pkStr = '{"key":"-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDE\\n-----END PRIVATE KEY-----"}';
  const maskedPkStr = maskData(pkStr);
  assert.strictEqual(maskedPkStr, '{"key":"-----BEGIN PRIVATE KEY-----\\\\n[REDACTED]\\\\n-----END PRIVATE KEY-----"}');
  // Should successfully parse as valid JSON
  assert.doesNotThrow(() => JSON.parse(maskedPkStr));
});
