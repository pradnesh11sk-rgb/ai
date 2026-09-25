// Theme management service with localStorage persistence and CSS data-theme application

export type ThemeId = 'cyber-violet' | 'cyber-emerald' | 'sapphire-frost' | 'crimson-aegis';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  colorPreview: string;
  accentColor: string;
  description: string;
}

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: 'cyber-violet',
    name: 'Cyberpunk Violet',
    colorPreview: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    accentColor: '#8b5cf6',
    description: 'Neon Obsidian & Ultraviolet Cyber Pulse'
  },
  {
    id: 'cyber-emerald',
    name: 'Military Emerald',
    colorPreview: 'linear-gradient(135deg, #10b981, #059669)',
    accentColor: '#10b981',
    description: 'Tactical Matrix & Vault Gold Defense'
  },
  {
    id: 'sapphire-frost',
    name: 'Electric Sapphire',
    colorPreview: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    accentColor: '#38bdf8',
    description: 'Arctic Subzero & Deep Space Cobalt'
  },
  {
    id: 'crimson-aegis',
    name: 'Crimson Aegis',
    colorPreview: 'linear-gradient(135deg, #ef4444, #f97316)',
    accentColor: '#ef4444',
    description: 'Blood Obsidian & Plasma Flare'
  }
];

const THEME_STORAGE_KEY = 'privora_active_theme';

export function getInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return 'cyber-violet';
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
  if (saved && AVAILABLE_THEMES.some(t => t.id === saved)) {
    return saved;
  }
  return 'cyber-violet';
}

export function applyTheme(themeId: ThemeId): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', themeId);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (e) {
    // Ignore storage errors in private browsing
  }
}
