import React, { createContext, useState, useContext } from 'react';
import { translations } from '../i18n/translations';

export const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(
    localStorage.getItem('lang') || 'ru'
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
