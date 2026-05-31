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
