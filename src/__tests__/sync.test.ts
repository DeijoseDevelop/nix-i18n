import { describe, it, expect } from "vitest";
import { createI18n } from "../core/createI18n";
import { syncLocalePlugin } from "../plugins/sync";
import type { Messages } from "../core/types";

const channels = new Map<string, Set<FakeBroadcastChannel>>();

class FakeBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
    if (!channels.has(name)) {
      channels.set(name, new Set());
    }
    channels.get(name)!.add(this);
  }

  postMessage(data: unknown) {
    const peers = channels.get(this.name);
    if (!peers) return;
    for (const peer of peers) {
      if (peer !== this && peer.onmessage) {
        peer.onmessage(new MessageEvent("message", { data }));
      }
    }
  }

  close() {
    channels.get(this.name)?.delete(this);
  }
}

describe("syncLocalePlugin", () => {
  it("synchronizes locale changes across tabs", () => {
    globalThis.BroadcastChannel = FakeBroadcastChannel as unknown as typeof BroadcastChannel;

    const i18nA = createI18n<Messages>({
      locale: "es",
      messages: { es: { hello: "Hola" }, en: { hello: "Hello" } },
    });

    const i18nB = createI18n<Messages>({
      locale: "es",
      messages: { es: { hello: "Hola" }, en: { hello: "Hello" } },
    });

    syncLocalePlugin(i18nA);
    syncLocalePlugin(i18nB);

    i18nA.setLocale("en");

    expect(i18nB.locale.value).toBe("en");
  });

  it("returns a cleanup function", () => {
    globalThis.BroadcastChannel = FakeBroadcastChannel as unknown as typeof BroadcastChannel;

    const i18n = createI18n<Messages>({
      locale: "es",
      messages: { es: { hello: "Hola" } },
    });

    const cleanup = syncLocalePlugin(i18n);
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does nothing when BroadcastChannel is unavailable", () => {
    const original = globalThis.BroadcastChannel;
    globalThis.BroadcastChannel = undefined as unknown as typeof BroadcastChannel;

    const i18n = createI18n<Messages>({
      locale: "es",
      messages: { es: { hello: "Hola" } },
    });

    const cleanup = syncLocalePlugin(i18n);
    expect(typeof cleanup).toBe("function");

    globalThis.BroadcastChannel = original;
  });
});
