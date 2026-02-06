// =============================================================================
// Theme Types
// =============================================================================

/** The two supported color scheme modes */
export type Theme = 'light' | 'dark'

/** A pair of Tailwind class strings — one for each mode */
export interface ThemeTokenValue {
  light: string
  dark: string
  description: string
}

/** Badge tokens have separate bg, text, and border classes per mode */
export interface BadgeTokenValue {
  light: { bg: string; text: string; border: string }
  dark: { bg: string; text: string; border: string }
  description: string
}

/** Filter chip tokens with hover states per mode */
export interface FilterChipTokenValue {
  light: { text: string; border: string; hoverBorder: string; hoverText: string }
  dark: { text: string; border: string; hoverBorder: string; hoverText: string }
  description: string
}

/** Selected filter chip tokens per mode */
export interface SelectedFilterChipTokenValue {
  light: { bg: string; text: string; border: string }
  dark: { bg: string; text: string; border: string }
  description: string
}

// =============================================================================
// Semantic Token Map
// =============================================================================

/** Full semantic color token map for both themes */
export interface ThemeTokens {
  backgrounds: {
    page: ThemeTokenValue
    pageAlt: ThemeTokenValue
    card: ThemeTokenValue
  }
  text: {
    heading: ThemeTokenValue
    body: ThemeTokenValue
    muted: ThemeTokenValue
    icon: ThemeTokenValue
  }
  borders: {
    card: ThemeTokenValue
    footer: ThemeTokenValue
    filterInactive: ThemeTokenValue
  }
  accents: {
    primary: ThemeTokenValue
    primaryHover: ThemeTokenValue
  }
  badges: {
    category: BadgeTokenValue
    event: BadgeTokenValue
  }
  filterChips: {
    categorySelected: SelectedFilterChipTokenValue
    eventSelected: SelectedFilterChipTokenValue
    inactive: FilterChipTokenValue
  }
  focus: {
    ringOffset: ThemeTokenValue
  }
  hover: {
    cardBorder: ThemeTokenValue
  }
}

// =============================================================================
// Component Class Mapping
// =============================================================================

/** A single element-level class transformation within a component */
export interface ClassChange {
  element: string
  current: string
  updated: string
}

/** Per-component mapping of current dark-only classes to dual-mode classes */
export interface ComponentClassMap {
  component: string
  file: string
  changes: ClassChange[]
}

// =============================================================================
// FOUC Prevention
// =============================================================================

/** Configuration for the inline theme-detection script */
export interface FoucPreventionConfig {
  description: string
  scriptContent: string
  placement: string
  behavior: string
}

// =============================================================================
// Hook: useThemeDetection
// =============================================================================

/** Return type of the useThemeDetection hook */
export interface UseThemeDetectionResult {
  /** The currently active theme based on system preference */
  theme: Theme
}

/**
 * Hook signature for useThemeDetection.
 *
 * Reads the initial system color scheme via matchMedia('(prefers-color-scheme: dark)'),
 * subscribes to changes, and toggles the .dark class on <html> accordingly.
 * Returns the current theme so components can conditionally render if needed.
 *
 * Usage:
 *   const { theme } = useThemeDetection()
 */
export type UseThemeDetection = () => UseThemeDetectionResult

// =============================================================================
// Section Props
// =============================================================================

export interface DarkAndLightModeProps {
  /** Current theme tokens (the full semantic map) */
  tokens: ThemeTokens
  /** Current active theme */
  theme: Theme
  /** Called when the system theme changes (from matchMedia listener) */
  onThemeChange?: (theme: Theme) => void
}
