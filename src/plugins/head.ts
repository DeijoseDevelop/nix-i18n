import { watch } from "@deijose/nix-js";
import type { I18nInstance, Messages } from "../core/types";

export type HeadOptions = {
  lang?: boolean;
  dir?: "ltr" | "rtl" | "auto";
  meta?: Array<{ name: string; content?: string | ((locale: string) => string) }>;
};

export function headPlugin<TMessages extends Messages>(
  i18n: I18nInstance<TMessages>,
  options: HeadOptions = {},
): () => void {
  const { lang = true, dir, meta = [] } = options;

  function update(locale: string) {
    if (typeof document === "undefined") return;

    if (lang) {
      document.documentElement.lang = locale;
    }
    if (dir) {
      document.documentElement.dir = dir === "auto" ? getDir(locale) : dir;
    }
    for (const item of meta) {
      const content = typeof item.content === "function" ? item.content(locale) : item.content;
      setMeta(item.name, content);
    }
  }

  function setMeta(name: string, content: string | undefined) {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement("meta");
      element.name = name;
      document.head.appendChild(element);
    }
    if (content !== undefined) {
      element.content = content;
    }
  }

  update(i18n.locale.value);
  const unwatch = watch(i18n.locale, update);

  return () => {
    unwatch();
  };
}

function getDir(locale: string): string {
  const rtl = new Set(["ar", "he", "fa", "ur"]);
  return rtl.has(locale.split("-")[0]) ? "rtl" : "ltr";
}
