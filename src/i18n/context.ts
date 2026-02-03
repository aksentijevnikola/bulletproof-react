import { createContext } from "react";
import type i18next from "i18next";
import type { SupportedLanguage } from "./index";

type TranslationOptionValue = string | number | boolean | null | undefined;

interface TranslationOptions {
  [key: string]: TranslationOptionValue;
}

export interface I18nContextType {
  changeLanguage: (lng: string) => Promise<void>;
  getLanguage: () => string;
  supportedLanguages: SupportedLanguage[];
  t: (key: string, options?: TranslationOptions) => string;
  i18n: typeof i18next;
}

export const I18nContext = createContext<I18nContextType | undefined>(
  undefined,
);
