export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'sbt-inventory-theme';

const isThemeMode = (value: string | null): value is ThemeMode => value === 'light' || value === 'dark';

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
  root.style.colorScheme = theme;
};

export const persistTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures; the in-memory theme still works.
  }
};
