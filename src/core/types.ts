import type { Signal, Store } from "@deijose/nix-js";

export type Primitive = string | number | boolean | null | undefined;

export type MessageValue = string | { [key: string]: MessageValue };

export type Messages = Record<string, MessageValue>;

export type InterpolationValue = Primitive | Signal<Primitive> | (() => Primitive);

export type InterpolationMap = Record<string, InterpolationValue>;

export type I18nBackend<TMessages extends Messages = Messages> = {
  load(locale: string, namespace: string): Promise<Partial<TMessages>> | Partial<TMessages>;
  supportsNamespaces?: boolean;
};

export type I18nOptions<TMessages extends Messages = Messages> = {
  locale: string;
  fallbackLocale?: string;
  messages?: Record<string, NoInfer<Partial<TMessages>>>;
  backend?: I18nBackend<TMessages>;
  namespaces?: string[];
  persist?: boolean | PersistOptions;
  detect?: boolean | DetectOptions;
};

export type PersistOptions = {
  key?: string;
  storage?: Storage;
};

export type DetectOptions = {
  order?: Array<"localStorage" | "sessionStorage" | "navigator" | "url" | "fallback">;
  storageKey?: string;
  urlParam?: string;
};

export type I18nStoreState<TMessages extends Messages = Messages> = {
  locale: string;
  messages: Record<string, Partial<TMessages>>;
  loadedNamespaces: string[];
  isLoading: boolean;
};

export type I18nStore<TMessages extends Messages = Messages> = Store<
  I18nStoreState<TMessages>,
  {
    setLocale(locale: string): void;
    setMessages(locale: string, messages: Partial<TMessages>): void;
    loadNamespace(namespace: string): Promise<void>;
  },
  {
    currentMessages: Signal<Partial<TMessages>>;
    fallbackMessages: Signal<Partial<TMessages>>;
  }
>;

export type I18nInstance<TMessages extends Messages = Messages> = I18nStore<TMessages> & {
  readonly fallbackLocale: string;
  t: TranslateFn;
  n: PluralFn;
  d: DateFormatterFn;
  nFormat: NumberFormatterFn;
  c: CurrencyFormatterFn;
  rt: RelativeTimeFormatterFn;
  list: ListFormatterFn;
  useNamespace: (namespace: string) => NamespaceApi;
};

export type TranslateFn = (
  key: MessagePath,
  params?: InterpolationParamsForPath,
  options?: { context?: string },
) => string;

export type PluralFn = (
  count: number,
  key: MessagePath,
  params?: InterpolationParamsForPath,
) => string;

export type NamespaceApi = {
  t: (
    key: MessagePath,
    params?: InterpolationParamsForPath,
    options?: { context?: string },
  ) => string;
  n: (
    count: number,
    key: MessagePath,
    params?: InterpolationParamsForPath,
  ) => string;
};

export type DateFormatterFn = (
  value: Date | number,
  options?: Intl.DateTimeFormatOptions,
) => string;

export type NumberFormatterFn = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => string;

export type CurrencyFormatterFn = (
  value: number,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
) => string;

export type RelativeTimeFormatterFn = (
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
) => string;

export type ListFormatterFn = (
  values: string[],
  options?: Intl.ListFormatOptions,
) => string;

export type MessagePath = string;

export type InterpolationParamsForPath = InterpolationMap | undefined;

export type InterpolationParams = InterpolationMap | undefined;
