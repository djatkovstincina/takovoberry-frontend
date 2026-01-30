export const i18n = {
  defaultLocale: 'sr',
  locales: ['en', 'sr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
