export type ThemeMode = 'light' | 'dark' | 'pain';

const THEME_STORAGE_KEY = 'sbt-inventory-theme';

const isThemeMode = (value: string | null): value is ThemeMode => value === 'light' || value === 'dark' || value === 'pain';

export const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'pain';

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(storedTheme)) return storedTheme;
  } catch {
    // Ignore storage failures and fall back to the default chaos theme.
  }

  return 'pain';
};

export const getNextTheme = (theme: ThemeMode): ThemeMode => {
  switch (theme) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'pain';
    default:
      return 'light';
  }
};

export const getThemeToggleLabel = (theme: ThemeMode) => {
  switch (theme) {
    case 'light':
      return 'Dark';
    case 'dark':
      return 'Pain';
    default:
      return 'Light';
  }
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('pain', theme === 'pain');
  root.dataset.theme = theme;
  root.style.colorScheme = theme === 'pain' ? 'dark' : theme;
};

export const persistTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures; the in-memory theme still works.
  }
};
