import { useI18n } from "./useI18n";

export const useI18nLanguage = () => {
  const { changeLanguage, getLanguage, supportedLanguages } = useI18n();
  return { changeLanguage, getLanguage, supportedLanguages };
};
