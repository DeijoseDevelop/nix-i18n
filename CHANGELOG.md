# Changelog

## 1.2.0

### Added

- `nestedFallback` option for `createI18n` to enable fallback chains like `auth.login.title` → `auth.login` → `title`.
- `nix-i18n-generate` CLI to generate JSON translation files with empty values for multiple locales.
- `devOverlayPlugin` to log and optionally display missing translation keys in development.
- Fixed `bin` path format in `package.json` to comply with npm requirements.

## 1.1.0

### Added

- `syncLocalePlugin` to synchronize locale across browser tabs via `BroadcastChannel`.
- `headPlugin` to update `html lang`, `dir`, and meta tags on locale changes.
- `detectLocalePlugin` now supports locale detection from URL path (`/es/about`) and base-locale normalization.
- `formValidationPlugin` improved with key prefix mapping and interpolation parameters for validator arguments.
- `icuPluralizePlugin` and `icuPluralize` utility for ICU plural syntax (`{count, plural, one {...} other {...}}`).
- `nix-i18n-extract` CLI to extract translation keys from source files.
- Type-safe key and interpolation parameter autocompletion via `MessageSchema`.
- Full test coverage for all new plugins and utilities.

## 1.0.0

### Added

- Reactive store-based i18n built on `@deijose/nix-js` signals.
- `createI18n` factory with inline messages and backend support.
- `t("key")` API with interpolation, contexts, and namespaces.
- Pluralization using pipe syntax.
- Formatters: date, number, currency, relative time, list.
- JSON and API backends with lazy namespace loading.
- Plugins: persistence, locale detection, router integration, form validation.
- Optional `provide/inject` support via `useI18n`.
- TypeScript support with autocompletion of keys and interpolation parameters.
- Full test coverage for core, formatters, and backends.
