# Changelog

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
