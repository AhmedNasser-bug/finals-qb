import { test, mock } from 'node:test';
import assert from 'node:assert';
import { logger } from './logger.ts';

test('logger methods use maskData', () => {
  const logMock = mock.method(console, 'log', () => {});
  logger.log({ api_key: '12345' });
  assert.strictEqual(logMock.mock.calls.length, 1);
  const loggedObj = logMock.mock.calls[0].arguments[0];
  assert.strictEqual(loggedObj.api_key, '[REDACTED]');
  logMock.mock.restore();

  const infoMock = mock.method(console, 'info', () => {});
  logger.info({ secret: 'my-secret' });
  assert.strictEqual(infoMock.mock.calls.length, 1);
  assert.strictEqual(infoMock.mock.calls[0].arguments[0].secret, '[REDACTED]');
  infoMock.mock.restore();

  const warnMock = mock.method(console, 'warn', () => {});
  logger.warn('Bearer my_token_123=');
  assert.strictEqual(warnMock.mock.calls.length, 1);
  assert.strictEqual(warnMock.mock.calls[0].arguments[0], 'Bearer [REDACTED]');
  warnMock.mock.restore();

  const errorMock = mock.method(console, 'error', () => {});
  const err = new Error('some error message password=mypassword');
  logger.error(err);
  assert.strictEqual(errorMock.mock.calls.length, 1);
  const loggedErr = errorMock.mock.calls[0].arguments[0];
  assert.ok(loggedErr instanceof Error);
  assert.strictEqual(loggedErr.message, 'some error message password="[REDACTED]"');
  errorMock.mock.restore();
});
