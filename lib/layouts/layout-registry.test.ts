import test from 'node:test'
import assert from 'node:assert/strict'
import { PAGE_LAYOUTS, DEFAULT_LAYOUT_ID, getLayoutById, isValidLayoutId } from './layout-registry'

test('Page Layout Registry: exports registered layouts', () => {
  assert.ok(PAGE_LAYOUTS.length >= 3, 'Must have at least 3 default layouts')
  const defaultLayout = PAGE_LAYOUTS.find((l) => l.id === DEFAULT_LAYOUT_ID)
  assert.ok(defaultLayout, 'Default layout must exist')
  assert.equal(defaultLayout.id, 'default-sidebar')
})

test('Page Layout Registry: all layouts conform to spec', () => {
  for (const layout of PAGE_LAYOUTS) {
    assert.ok(layout.id, 'Layout must have an id')
    assert.ok(layout.name, 'Layout must have a name')
    assert.ok(layout.description, 'Layout must have a description')
    assert.ok(layout.iconName, 'Layout must have an iconName')
  }
})

test('Page Layout Registry: getLayoutById fallback logic', () => {
  const existing = getLayoutById('zen-focus')
  assert.equal(existing.id, 'zen-focus')
  assert.equal(existing.name, 'Zen Minimal')

  const fallback = getLayoutById('non-existent-layout')
  assert.equal(fallback.id, DEFAULT_LAYOUT_ID)

  const nullFallback = getLayoutById(null)
  assert.equal(nullFallback.id, DEFAULT_LAYOUT_ID)
})

test('Page Layout Registry: isValidLayoutId validation', () => {
  assert.equal(isValidLayoutId('default-sidebar'), true)
  assert.equal(isValidLayoutId('zen-focus'), true)
  assert.equal(isValidLayoutId('split-terminal'), true)
  assert.equal(isValidLayoutId('invalid-layout'), false)
})
