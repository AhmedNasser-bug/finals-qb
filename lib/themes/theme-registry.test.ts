import test from 'node:test'
import assert from 'node:assert/strict'
import { COLOR_THEMES, DEFAULT_THEME_ID, DEFAULT_LIGHT_THEME_ID, getThemeById, isValidThemeId, getThemesByMode, toggleThemeMode } from './theme-registry'

test('Color Theme Registry: exports all registered themes', () => {
  assert.ok(COLOR_THEMES.length >= 10, 'Must have at least 10 registered themes')
  const defaultTheme = COLOR_THEMES.find((t) => t.id === DEFAULT_THEME_ID)
  assert.ok(defaultTheme, 'Default theme must be present in registry')
  assert.equal(defaultTheme.id, 'amber-phosphor')

  const paperTheme = COLOR_THEMES.find((t) => t.id === 'paper-mono')
  assert.ok(paperTheme, 'Paper Mono must exist in registry')
  assert.equal(paperTheme.mode, 'light')

  const parchmentTheme = COLOR_THEMES.find((t) => t.id === 'solar-parchment')
  assert.ok(parchmentTheme, 'Solar Parchment must exist in registry')
  assert.equal(parchmentTheme.mode, 'light')

  const glacierTheme = COLOR_THEMES.find((t) => t.id === 'nordic-glacier')
  assert.ok(glacierTheme, 'Nordic Glacier must exist in registry')
  assert.equal(glacierTheme.mode, 'light')
})

test('Color Theme Registry: all themes have required tokens and valid mode', () => {
  for (const theme of COLOR_THEMES) {
    assert.ok(theme.id, 'Theme must have an id')
    assert.ok(theme.name, 'Theme must have a name')
    assert.ok(theme.mode === 'dark' || theme.mode === 'light', 'Theme mode must be dark or light')
    assert.ok(theme.preview?.accent, 'Theme must have preview accent color')
    assert.ok(theme.tokens.background, 'Theme must define background token')
    assert.ok(theme.tokens.foreground, 'Theme must define foreground token')
    assert.ok(theme.tokens.primary, 'Theme must define primary token')
    assert.ok(theme.tokens.border, 'Theme must define border token')
    assert.ok(theme.tokens.card, 'Theme must define card token')
  }
})

test('Color Theme Registry: getThemesByMode filters correctly', () => {
  const darkThemes = getThemesByMode('dark')
  const lightThemes = getThemesByMode('light')

  assert.ok(darkThemes.length >= 7, 'Must have at least 7 dark themes')
  assert.ok(lightThemes.length >= 3, 'Must have at least 3 light themes')
  assert.ok(darkThemes.every((t) => t.mode === 'dark'))
  assert.ok(lightThemes.every((t) => t.mode === 'light'))
})

test('Color Theme Registry: toggleThemeMode swaps dark and light pairings', () => {
  assert.equal(toggleThemeMode('amber-phosphor'), 'paper-mono')
  assert.equal(toggleThemeMode('paper-mono'), 'amber-phosphor')
  assert.equal(toggleThemeMode('solar-sepia'), 'solar-parchment')
  assert.equal(toggleThemeMode('solar-parchment'), 'solar-sepia')
  assert.equal(toggleThemeMode('nordic-frost'), 'nordic-glacier')
  assert.equal(toggleThemeMode('nordic-glacier'), 'nordic-frost')
})

test('Color Theme Registry: getThemeById fallback logic', () => {
  const existing = getThemeById('synthwave-neon')
  assert.equal(existing.id, 'synthwave-neon')
  assert.equal(existing.name, 'Synthwave 84')

  const paper = getThemeById('paper-mono')
  assert.equal(paper.id, 'paper-mono')
  assert.equal(paper.mode, 'light')

  const fallback = getThemeById('non-existent-theme-id')
  assert.equal(fallback.id, DEFAULT_THEME_ID, 'Must fallback to default theme on invalid id')

  const nullFallback = getThemeById(null)
  assert.equal(nullFallback.id, DEFAULT_THEME_ID)
})

test('Color Theme Registry: isValidThemeId validation', () => {
  assert.equal(isValidThemeId('amber-phosphor'), true)
  assert.equal(isValidThemeId('paper-mono'), true)
  assert.equal(isValidThemeId('solar-parchment'), true)
  assert.equal(isValidThemeId('nordic-glacier'), true)
  assert.equal(isValidThemeId('invalid-theme'), false)
})

