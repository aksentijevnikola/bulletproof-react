import { useI18n } from "./useI18n";

export const useI18nTranslation = () => {
  const { t } = useI18n();
  return { t };
};
