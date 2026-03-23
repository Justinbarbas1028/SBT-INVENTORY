export type ThemeMode = 'light' | 'dark' | 'rainbow';

const THEME_STORAGE_KEY = 'sbt-inventory-theme';
const RAINBOW_UPDATE_MS = 50;

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'rainbow';

const setRainbowPalette = (hue: number) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--app-bg', `hsl(${hue} 100% 94%)`);
  root.style.setProperty('--app-surface', `hsl(${(hue + 24) % 360} 100% 98% / 0.92)`);
  root.style.setProperty('--app-surface-soft', `hsl(${(hue + 48) % 360} 100% 90% / 0.78)`);
  root.style.setProperty('--app-surface-muted', `hsl(${(hue + 96) % 360} 90% 84% / 0.88)`);
  root.style.setProperty('--app-border', `hsl(${(hue + 132) % 360} 80% 72% / 0.75)`);
  root.style.setProperty('--app-border-strong', `hsl(${(hue + 168) % 360} 85% 58% / 0.9)`);
  root.style.setProperty('--app-text', `hsl(${(hue + 210) % 360} 70% 18%)`);
  root.style.setProperty('--app-text-muted', `hsl(${(hue + 230) % 360} 45% 32%)`);
  root.style.setProperty('--app-accent', `hsl(${(hue + 260) % 360} 95% 55%)`);
  root.style.setProperty('--app-accent-soft', `hsl(${(hue + 300) % 360} 100% 88% / 0.82)`);
};

export const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(storedTheme)) return storedTheme;
  } catch {
    // Ignore storage failures and fall back to system preference.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

  if (theme === 'rainbow') {
    setRainbowPalette(Date.now() / 12 % 360);
    return;
  }

  root.style.removeProperty('--app-bg');
  root.style.removeProperty('--app-surface');
  root.style.removeProperty('--app-surface-soft');
  root.style.removeProperty('--app-surface-muted');
  root.style.removeProperty('--app-border');
  root.style.removeProperty('--app-border-strong');
  root.style.removeProperty('--app-text');
  root.style.removeProperty('--app-text-muted');
  root.style.removeProperty('--app-accent');
  root.style.removeProperty('--app-accent-soft');
};

export const startRainbowTheme = () => {
  if (typeof window === 'undefined') return () => undefined;

  let hue = Date.now() / 12 % 360;
  setRainbowPalette(hue);

  const intervalId = window.setInterval(() => {
    hue = (hue + 3) % 360;
    setRainbowPalette(hue);
  }, RAINBOW_UPDATE_MS);

  return () => window.clearInterval(intervalId);
};

export const persistTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures; the in-memory theme still works.
  }
};
