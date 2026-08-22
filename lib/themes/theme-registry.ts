import type { ColorThemeSpec } from './theme-types'
import { amberPhosphorTheme } from './definitions/amber-phosphor'
import { cyberEmeraldTheme } from './definitions/cyber-emerald'
import { midnightSapphireTheme } from './definitions/midnight-sapphire'
import { crimsonDraculaTheme } from './definitions/crimson-dracula'
import { solarSepiaTheme } from './definitions/solar-sepia'
import { synthwaveNeonTheme } from './definitions/synthwave-neon'
import { nordicFrostTheme } from './definitions/nordic-frost'

export const COLOR_THEMES: ColorThemeSpec[] = [
  amberPhosphorTheme,
  cyberEmeraldTheme,
  midnightSapphireTheme,
  crimsonDraculaTheme,
  solarSepiaTheme,
  synthwaveNeonTheme,
  nordicFrostTheme,
]

export const DEFAULT_THEME_ID = amberPhosphorTheme.id

export function getThemeById(id: string | null | undefined): ColorThemeSpec {
  if (!id) return amberPhosphorTheme
  const found = COLOR_THEMES.find((t) => t.id === id)
  return found || amberPhosphorTheme
}

export function isValidThemeId(id: string): boolean {
  return COLOR_THEMES.some((t) => t.id === id)
}
