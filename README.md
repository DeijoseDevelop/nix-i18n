# @deijose/nix-i18n

Internationalization library for [Nix.js](https://nix-js.dev) built on signals and stores.

## Features

- Reactive translations powered by Nix.js signals.
- Zero runtime dependencies (uses native `Intl` API).
- Small bundle size (~4-5 KB typical).
- Type-safe keys and interpolation parameters.
- Multiple backends: inline objects, JSON files, API.
- Lazy-loaded namespaces.
- Pluralization, contexts, and namespaces.
- Date, number, currency, relative time, and list formatting.
- Optional plugins for persistence, locale detection (URL, path, navigator, storage), router integration, form validation, head tags, cross-tab sync, and ICU pluralization.
- Optional `provide/inject` support for sub-trees and tenants.
- CLI to extract translation keys from source files.

## Installation

```bash
npm install @deijose/nix-i18n
```

Peer dependency:

```bash
npm install @deijose/nix-js
```

## Quick start

```ts
import { createI18n } from "@deijose/nix-i18n";
import { html } from "@deijose/nix-js";

const i18n = createI18n({
  locale: "es",
  fallbackLocale: "en",
  messages: {
    es: { hello: "Hola {name}" },
    en: { hello: "Hello {name}" },
  },
});

function App() {
  return html`
    <h1>${i18n.t("hello", { name: "Deiver" })}</h1>
    <button @click=${() => i18n.setLocale("en")}>English</button>
  `;
}
```

## Pluralization

Use the pipe syntax for plural forms:

```json
{
  "items": "No items | One item | {count} items"
}
```

```ts
i18n.t("items", { count: 5 }); // "5 items"
```

## Namespaces

```ts
const auth = i18n.useNamespace("auth");
auth.t("login.title"); // resolves "auth:login.title"
```

Or use the key directly:

```ts
i18n.t("auth:login.title");
```

## Backends

### JSON backend

```ts
import { jsonBackend } from "@deijose/nix-i18n/backends/json";

const i18n = createI18n({
  locale: "es",
  backend: jsonBackend({
    baseUrl: "/locales",
    namespaces: ["common", "auth"],
  }),
});
```

Loads `/locales/es/common.json`, `/locales/en/common.json`, etc.

### API backend

```ts
import { apiBackend } from "@deijose/nix-i18n/backends/api";

const i18n = createI18n({
  locale: "es",
  backend: apiBackend({
    url: "/api/translations",
    headers: { Authorization: "Bearer ..." },
  }),
});
```

## Formatters

All formatters use the `Intl` API and react to locale changes.

```ts
i18n.d(new Date(), { dateStyle: "long" });
i18n.nFormat(1234.5, { maximumFractionDigits: 2 });
i18n.c(99.9, "USD");
i18n.rt(-1, "day");
i18n.list(["a", "b", "c"], { type: "conjunction" });
```

## Plugins

### Persist locale

```ts
import { persistLocalePlugin } from "@deijose/nix-i18n/plugins/persist";

persistLocalePlugin(i18n, { key: "app-locale" });
```

### Detect locale

```ts
import { detectLocalePlugin } from "@deijose/nix-i18n/plugins/detect";

detectLocalePlugin(i18n, {
  order: ["localStorage", "navigator", "fallback"],
});
```

### Router integration

```ts
import { routerLocalePlugin } from "@deijose/nix-i18n/plugins/router";

routerLocalePlugin(i18n, router, { mode: "query" });
```

### Head tags

```ts
import { headPlugin } from "@deijose/nix-i18n/plugins/head";

headPlugin(i18n, {
  lang: true,
  dir: "auto",
  meta: [{ name: "description", content: (locale) => descriptions[locale] }],
});
```

### Cross-tab sync

```ts
import { syncLocalePlugin } from "@deijose/nix-i18n/plugins/sync";

syncLocalePlugin(i18n);
```

### Form validation

```ts
import { formValidationPlugin } from "@deijose/nix-i18n/plugins/forms";

const validators = formValidationPlugin(i18n, {
  required: () => (value) => value ? undefined : "required",
  minLength: (n) => (value) => String(value).length < n ? "minLength" : undefined,
}, { keyPrefix: "errors" });
```

### ICU pluralization

```ts
import { icuPluralizePlugin } from "@deijose/nix-i18n/plugins/icuPluralize";

icuPluralizePlugin(i18n);

const messages = {
  en: { items: "{count, plural, one {# item} other {# items}}" },
};

i18n.t("items", { count: 5 }); // "5 items"
```

## CLI

Extract translation keys from source files:

```bash
npx nix-i18n-extract src --output extracted-keys.json
```

## TypeScript

```ts
const i18n = createI18n({
  locale: "es",
  messages: {
    es: { hello: "Hola {name}" },
  },
});

i18n.t("hello", { name: "Deiver" }); // OK
i18n.t("helo"); // Type error
i18n.t("hello"); // Type error: missing `name`
```

## License

MIT
