import { useI18n } from "@i18n/hooks/useI18n";
import { useI18nTranslation } from "@i18n/hooks/useI18nTranslation";
import { useCurrentI18nLanguage } from "@i18n/hooks/useCurrentI18nLanguage";
import type { SupportedLanguage } from "@i18n/index";

const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
};

const languageFlags: Record<SupportedLanguage, string> = {
  en: "GB",
};

type LanguageSwitcherProps = {
  className?: string;
  variant?: "select" | "buttons";
};

const buttonActiveClassName =
  "flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors bg-primary-subtle text-primary-subtle-foreground";
const buttonInactiveClassName =
  "flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors bg-muted text-foreground hover:bg-primary-subtle hover:text-primary-subtle-foreground";
const selectClassName =
  "w-full appearance-none rounded-md border border-input bg-card px-3 py-1 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export const LanguageSwitcher = ({
  className = "",
  variant = "select",
}: LanguageSwitcherProps) => {
  const { changeLanguage, supportedLanguages } = useI18n();
  const { currentLanguage } = useCurrentI18nLanguage();
  const { t } = useI18nTranslation();

  const handleLanguageChange = async (language: SupportedLanguage) => {
    await changeLanguage(language);
  };

  if (variant === "buttons") {
    return (
      <div className={className}>
        <div className="flex gap-2">
          {supportedLanguages.map((lang: SupportedLanguage) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={
                currentLanguage === lang
                  ? buttonActiveClassName
                  : buttonInactiveClassName
              }
              title={languageNames[lang]}
            >
              <span className="text-base">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative">
        <select
          value={currentLanguage}
          onChange={(event) =>
            handleLanguageChange(event.target.value as SupportedLanguage)
          }
          className={selectClassName}
          title={t("language.select")}
        >
          {supportedLanguages.map((lang: SupportedLanguage) => (
            <option key={lang} value={lang}>
              {languageFlags[lang]} {languageNames[lang]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
