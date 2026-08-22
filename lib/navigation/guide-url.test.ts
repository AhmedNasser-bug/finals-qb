import test from 'node:test'
import assert from 'node:assert/strict'
import { buildGuideUrl, resolveGuideReturnNavigation } from './guide-url'

test('Guide URL Builder: generates default URL when empty', () => {
  assert.equal(buildGuideUrl(), '/guide')
  assert.equal(buildGuideUrl({}), '/guide')
})

test('Guide URL Builder: attaches from, from_name, and UTM params', () => {
  const url = buildGuideUrl({
    fromUrl: '/?subject=system-programming',
    fromName: 'System Programming',
    utmSource: 'subject_console',
    utmMedium: 'top_nav',
  })

  assert.ok(url.startsWith('/guide?'))
  assert.ok(url.includes('from=%2F%3Fsubject%3Dsystem-programming'))
  assert.ok(url.includes('from_name=System+Programming'))
  assert.ok(url.includes('utm_source=subject_console'))
  assert.ok(url.includes('utm_medium=top_nav'))
})

test('Guide Return Navigation: resolves from URL and human name', () => {
  const params = new URLSearchParams({
    from: '/?subject=computer-networks',
    from_name: 'Computer Networks',
    utm_source: 'side_nav',
  })

  const nav = resolveGuideReturnNavigation(params)
  assert.equal(nav.href, '/?subject=computer-networks')
  assert.equal(nav.label, 'RETURN TO COMPUTER NETWORKS')
  assert.equal(nav.sourceName, 'Computer Networks')
  assert.equal(nav.utmSource, 'side_nav')
})

test('Guide Return Navigation: infers human title from URL when from_name is missing', () => {
  const params = new URLSearchParams({
    from: '/?subject=system-programming',
  })

  const nav = resolveGuideReturnNavigation(params)
  assert.equal(nav.href, '/?subject=system-programming')
  assert.equal(nav.label, 'RETURN TO SYSTEM PROGRAMMING')
  assert.equal(nav.sourceName, 'System Programming')
})

test('Guide Return Navigation: handles subjectId fallback with title inference', () => {
  const params = new URLSearchParams({
    subject: 'theory-of-computation',
  })

  const nav = resolveGuideReturnNavigation(params)
  assert.equal(nav.href, '/?subject=theory-of-computation')
  assert.equal(nav.label, 'RETURN TO THEORY OF COMPUTATION')
  assert.equal(nav.sourceName, 'Theory Of Computation')
})

test('Guide Return Navigation: defaults to /subjects when empty', () => {
  const params = new URLSearchParams()
  const nav = resolveGuideReturnNavigation(params)
  assert.equal(nav.href, '/subjects')
  assert.equal(nav.label, 'RETURN TO SUBJECTS')
  assert.equal(nav.sourceName, undefined)
})

test('Guide Return Navigation: security sanitization blocks open redirects', () => {
  const malicious = new URLSearchParams({
    from: 'https://evil.com/phishing',
    from_name: 'Evil Page',
  })

  const nav = resolveGuideReturnNavigation(malicious)
  assert.notEqual(nav.href, 'https://evil.com/phishing')
  assert.equal(nav.href, '/subjects')
  assert.equal(nav.label, 'RETURN TO SUBJECTS')
})
