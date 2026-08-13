import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGUAGES, messages, type LanguageCode, type MessageKey } from './messages';

export { LANGUAGES };
export type { LanguageCode, MessageKey };

const STORAGE_KEY = 'imacocos:lang';
const DEFAULT_LANGUAGE: LanguageCode = 'ja';

type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

type I18nValue = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: Translate;
};

const I18nContext = createContext<I18nValue | null>(null);

function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // 会場は日本なので既定は日本語。一度選んだ言語だけ端末に残す
  const [lang, setLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? '';
    return isLanguageCode(saved) ? saved : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    // 読み上げや検索エンジンが言語を取り違えないようにする
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback<Translate>(
    (key, params) => {
      const template = messages[lang][key] ?? messages[DEFAULT_LANGUAGE][key];
      if (!params) return template;

      return Object.entries(params).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        template,
      );
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n は I18nProvider の内側で使ってください');
  return value;
}
