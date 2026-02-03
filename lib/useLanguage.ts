'use client';

import { useState, useEffect } from 'react';
import translations from './translations.json';

type Language = 'en' | 'id';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'en' || stored === 'id')) {
      setLanguage(stored);
    }
    setMounted(true);
  }, []);

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];

    for (const key of keys) {
      value = value?.[key];
    }

    return value || path;
  };

  return { language, updateLanguage, t, mounted };
}
