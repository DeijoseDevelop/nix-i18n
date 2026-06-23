import type { Validator } from "@deijose/nix-js";
import type { I18nInstance, Messages } from "../core/types";

export type FormValidationPluginOptions = {
  keyPrefix?: string;
};

export function formValidationPlugin<TMessages extends Messages>(
  i18n: I18nInstance<TMessages>,
  validators: Record<string, (...args: unknown[]) => Validator<unknown>>,
  options: FormValidationPluginOptions = {},
): Record<string, (...args: unknown[]) => Validator<unknown>> {
  const prefix = options.keyPrefix ? `${options.keyPrefix}:` : "";
  const wrapped: Record<string, (...args: unknown[]) => Validator<unknown>> = {};

  for (const [name, factory] of Object.entries(validators)) {
    wrapped[name] = (...args: unknown[]) => {
      const validator = factory(...args);
      return (value: unknown) => {
        const result = validator(value);
        if (result) {
          const key = `${prefix}${name}`;
          const translated = i18n.t(key as never, result as never, {}) ?? result;
          return translated;
        }
        return undefined;
      };
    };
  }

  return wrapped;
}
