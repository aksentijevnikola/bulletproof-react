import type { SupportedLanguage } from "../index";
import { useI18n } from "./useI18n";

export const useCurrentI18nLanguage = () => {
  const { getLanguage, supportedLanguages } = useI18n();
  const currentLanguage = getLanguage();
  const isSupported = supportedLanguages.includes(
    currentLanguage as SupportedLanguage,
  );

  return {
    currentLanguage: isSupported
      ? (currentLanguage as SupportedLanguage)
      : "en",
    isSupported,
    supportedLanguages,
  };
};
