import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { ENV } from "@shared/config/environment";

// Import translation resources
import enTranslations from "./locales/en.json";

const resources = {
  en: {
    translation: enTranslations,
  },
};

const supportedLanguages = ["en"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Set English as default language
    fallbackLng: "en", // Set English as fallback language
    debug: ENV.IS_DEV,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "selected-language",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    returnEmptyString: false,
  });

// Export supported languages for UI components
export { supportedLanguages };

// Add custom language change function
export const changeLanguage = async (lng: string) => {
  if (supportedLanguages.includes(lng)) {
    await i18n.changeLanguage(lng);
    localStorage.setItem("selected-language", lng);
  }
};

// Custom hook for getting language with fallback
export const getLanguage = () => {
  return i18n.language || "en";
};

// Type for supported languages
export type SupportedLanguage = "en";

export default i18n;
