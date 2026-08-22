import test from 'node:test'
import assert from 'node:assert/strict'
import { COLOR_THEMES, DEFAULT_THEME_ID, getThemeById, isValidThemeId } from './theme-registry'

test('Color Theme Registry: exports all registered themes', () => {
  assert.ok(COLOR_THEMES.length >= 7, 'Must have at least 7 registered themes')
  const defaultTheme = COLOR_THEMES.find((t) => t.id === DEFAULT_THEME_ID)
  assert.ok(defaultTheme, 'Default theme must be present in registry')
  assert.equal(defaultTheme.id, 'amber-phosphor')

  const synthTheme = COLOR_THEMES.find((t) => t.id === 'synthwave-neon')
  assert.ok(synthTheme, 'Synthwave Neon must exist in registry')

  const frostTheme = COLOR_THEMES.find((t) => t.id === 'nordic-frost')
  assert.ok(frostTheme, 'Nordic Frost must exist in registry')
})

test('Color Theme Registry: all themes have required tokens', () => {
  for (const theme of COLOR_THEMES) {
    assert.ok(theme.id, 'Theme must have an id')
    assert.ok(theme.name, 'Theme must have a name')
    assert.ok(theme.preview?.accent, 'Theme must have preview accent color')
    assert.ok(theme.tokens.background, 'Theme must define background token')
    assert.ok(theme.tokens.foreground, 'Theme must define foreground token')
    assert.ok(theme.tokens.primary, 'Theme must define primary token')
    assert.ok(theme.tokens.border, 'Theme must define border token')
    assert.ok(theme.tokens.card, 'Theme must define card token')
  }
})

test('Color Theme Registry: getThemeById fallback logic', () => {
  const existing = getThemeById('synthwave-neon')
  assert.equal(existing.id, 'synthwave-neon')
  assert.equal(existing.name, 'Synthwave Neon')

  const frost = getThemeById('nordic-frost')
  assert.equal(frost.id, 'nordic-frost')
  assert.equal(frost.name, 'Nordic Frost')

  const fallback = getThemeById('non-existent-theme-id')
  assert.equal(fallback.id, DEFAULT_THEME_ID, 'Must fallback to default theme on invalid id')

  const nullFallback = getThemeById(null)
  assert.equal(nullFallback.id, DEFAULT_THEME_ID)
})

test('Color Theme Registry: isValidThemeId validation', () => {
  assert.equal(isValidThemeId('amber-phosphor'), true)
  assert.equal(isValidThemeId('synthwave-neon'), true)
  assert.equal(isValidThemeId('nordic-frost'), true)
  assert.equal(isValidThemeId('invalid-theme'), false)
})
