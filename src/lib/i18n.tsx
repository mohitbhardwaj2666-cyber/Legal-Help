import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'en' | 'hi';

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.portal': 'Client Portal',
    'nav.consult': 'Consult Now',
    'nav.intake': 'Client Intake',
    'nav.caseStudies': 'Case Studies',
    'lang.label': 'HI',
  },
  hi: {
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.services': 'सेवाएं',
    'nav.blog': 'ब्लॉग',
    'nav.contact': 'संपर्क',
    'nav.portal': 'क्लाइंट पोर्टल',
    'nav.consult': 'अभी परामर्श करें',
    'nav.intake': 'क्लाइंट इंटेक',
    'nav.caseStudies': 'केस स्टडीज',
    'lang.label': 'EN',
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
