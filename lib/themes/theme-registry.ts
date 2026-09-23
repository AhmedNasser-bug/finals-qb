import type { ColorThemeSpec, ThemeMode } from './theme-types'
import { amberPhosphorTheme } from './definitions/amber-phosphor'
import { cyberEmeraldTheme } from './definitions/cyber-emerald'
import { midnightSapphireTheme } from './definitions/midnight-sapphire'
import { crimsonDraculaTheme } from './definitions/crimson-dracula'
import { solarSepiaTheme } from './definitions/solar-sepia'
import { synthwaveNeonTheme } from './definitions/synthwave-neon'
import { nordicFrostTheme } from './definitions/nordic-frost'
import { paperMonoTheme } from './definitions/paper-mono'
import { solarParchmentTheme } from './definitions/solar-parchment'
import { nordicGlacierTheme } from './definitions/nordic-glacier'

export const COLOR_THEMES: ColorThemeSpec[] = [
  amberPhosphorTheme,
  paperMonoTheme,
  solarParchmentTheme,
  nordicGlacierTheme,
  cyberEmeraldTheme,
  midnightSapphireTheme,
  crimsonDraculaTheme,
  solarSepiaTheme,
  synthwaveNeonTheme,
  nordicFrostTheme,
]

export const DEFAULT_THEME_ID = amberPhosphorTheme.id
export const DEFAULT_LIGHT_THEME_ID = paperMonoTheme.id

export function getThemeById(id: string | null | undefined): ColorThemeSpec {
  if (!id) return amberPhosphorTheme
  const found = COLOR_THEMES.find((t) => t.id === id)
  return found || amberPhosphorTheme
}

export function isValidThemeId(id: string): boolean {
  return COLOR_THEMES.some((t) => t.id === id)
}

export function getThemesByMode(mode: ThemeMode): ColorThemeSpec[] {
  return COLOR_THEMES.filter((t) => t.mode === mode)
}

/**
 * Quick toggle between corresponding Dark and Light themes.
 */
export function toggleThemeMode(currentThemeId: string): string {
  const current = getThemeById(currentThemeId)
  if (current.mode === 'dark') {
    if (current.id === 'solar-sepia') return solarParchmentTheme.id
    if (current.id === 'nordic-frost' || current.id === 'midnight-sapphire') return nordicGlacierTheme.id
    return paperMonoTheme.id
  } else {
    if (current.id === 'solar-parchment') return solarSepiaTheme.id
    if (current.id === 'nordic-glacier') return nordicFrostTheme.id
    return amberPhosphorTheme.id
  }
}

