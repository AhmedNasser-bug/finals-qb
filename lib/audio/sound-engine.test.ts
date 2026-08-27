import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isAudioMuted,
  setAudioMuted,
  toggleAudioMute,
  playKeyClick,
  playCorrectChime,
  playWrongBuzzer,
  playShieldEarned,
  playShieldAbsorbed,
  playSessionComplete,
} from './sound-engine'

test('Sound Engine: manages mute state safely', () => {
  setAudioMuted(true)
  assert.equal(isAudioMuted(), true)

  setAudioMuted(false)
  assert.equal(isAudioMuted(), false)

  const toggled = toggleAudioMute()
  assert.equal(toggled, true)
  assert.equal(isAudioMuted(), true)

  const toggledBack = toggleAudioMute()
  assert.equal(toggledBack, false)
  assert.equal(isAudioMuted(), false)
})

test('Sound Engine: audio playback functions execute without throwing in node/SSR', () => {
  assert.doesNotThrow(() => playKeyClick())
  assert.doesNotThrow(() => playCorrectChime())
  assert.doesNotThrow(() => playWrongBuzzer())
  assert.doesNotThrow(() => playShieldEarned())
  assert.doesNotThrow(() => playShieldAbsorbed())
  assert.doesNotThrow(() => playSessionComplete())
})
