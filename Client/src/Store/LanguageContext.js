import React, { createContext, useContext, useState } from 'react';

// القيم الافتراضية
const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 