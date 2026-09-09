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

test('matches prefixed api keys', () => {
  const result = maskData({ stripe_api_key: '12345', some_secret_value: 'my-password', normal_key: 'safe_value' });
  assert.strictEqual(result.stripe_api_key, '[REDACTED]');
  assert.strictEqual(result.some_secret_value, '[REDACTED]');
  assert.strictEqual(result.normal_key, 'safe_value');
});

test('handles raw JSON strings with prefixed api keys', () => {
  const result = maskData('{"stripe_api_key": "12345", "nested": {"my_secret": "supersecret"}, "password_hash": "12345"}');
  assert.strictEqual(result, '{"stripe_api_key":"[REDACTED]","nested":{"my_secret":"[REDACTED]"},"password_hash":"[REDACTED]"}');
});

test('redacts private keys without breaking JSON parsing', () => {
  const rawKey = "-----BEGIN PRIVATE KEY-----\\nMIICXAIBAAKBgQDCr\\n-----END PRIVATE KEY-----";
  const jsonStr = JSON.stringify({ key: rawKey });
  const result = maskData(jsonStr);
  assert.doesNotThrow(() => JSON.parse(result));
});

test('masks IPv4 addresses', () => {
  const result1 = maskData('Connecting to 192.168.1.1 for database');
  assert.strictEqual(result1, 'Connecting to [REDACTED] for database');

  const result2 = maskData('{"ip": "10.0.0.1"}');
  assert.strictEqual(result2, '{"ip":"[REDACTED]"}');
});

test('masks IPv6 addresses', () => {
  const result1 = maskData('Request from 2001:0db8:85a3:0000:0000:8a2e:0370:7334 processed');
  assert.strictEqual(result1, 'Request from [REDACTED] processed');

  const result2 = maskData('{"client_ip": "fe80:0000:0000:0000:0204:61ff:fe9d:f156"}');
  assert.strictEqual(result2, '{"client_ip":"[REDACTED]"}');
});

test('masks MAC addresses', () => {
  const result1 = maskData('Device MAC Address: 00:1A:2B:3C:4D:5E');
  assert.strictEqual(result1, 'Device MAC Address: [REDACTED]');

  const result2 = maskData('{"device_mac": "00-1A-2B-3C-4D-5E"}');
  assert.strictEqual(result2, '{"device_mac":"[REDACTED]"}');
});
