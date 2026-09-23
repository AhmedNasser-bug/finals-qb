export interface ColorThemeTokens {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  panel?: string
  panelForeground?: string
  panelBorder?: string
  surfaceContainer?: string
  surfaceContainerLow?: string
  surfaceContainerHigh?: string
}

export type ThemeMode = 'dark' | 'light'

export interface ColorThemeSpec {
  id: string
  name: string
  label: string
  mode: ThemeMode
  description: string
  preview: {
    accent: string
    bg: string
    surface: string
    border: string
  }
  tokens: ColorThemeTokens
}

