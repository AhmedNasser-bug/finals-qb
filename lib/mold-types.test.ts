import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './mold-types.ts';

test('formatTime utility', async (t) => {
  await t.test('returns "—" for 0 seconds', () => {
    assert.strictEqual(formatTime(0), "—");
  });

  await t.test('formats seconds under a minute correctly', () => {
    assert.strictEqual(formatTime(45), "0:45");
  });

  await t.test('formats seconds over a minute correctly', () => {
    assert.strictEqual(formatTime(125), "2:05");
  });

  await t.test('formats exactly 60 seconds correctly', () => {
    assert.strictEqual(formatTime(60), "1:00");
  });

  await t.test('formats large values into total minutes correctly', () => {
    // 3661 seconds = 61 minutes and 1 second
    assert.strictEqual(formatTime(3661), "61:01");
  });
});
