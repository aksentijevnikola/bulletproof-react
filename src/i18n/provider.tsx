import type { ReactNode } from "react";
import React, { useMemo } from "react";
import { useTranslation as useReactTranslation } from "react-i18next";
import type { SupportedLanguage } from "./index";
import { changeLanguage, getLanguage } from "./index";
import { I18nContext } from "./context";

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { t, i18n } = useReactTranslation();

  const contextValue = useMemo(
    () => ({
      changeLanguage,
      getLanguage,
      supportedLanguages: ["en"] as SupportedLanguage[],
      t,
      i18n,
    }),
    [t, i18n],
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};

export default I18nProvider;
