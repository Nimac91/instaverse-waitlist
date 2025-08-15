import React, { useState, useEffect, useRef, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckIcon, CaretDownIcon } from './Icons';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSwitcherProps {
  languages: Language[];
}

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ languages }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => i18n.language.startsWith(lang.code)) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={switcherRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Language selector"
      >
        <span className="text-2xl" aria-hidden="true">{currentLanguage.flag}</span>
        <CaretDownIcon className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up"
          role="listbox"
          aria-orientation="vertical"
        >
          <ul className="py-2" role="none">
            {languages.map((lang) => (
              <li key={lang.code} role="none">
                <button
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full text-left flex items-center justify-between px-4 py-3 text-base text-gray-700 hover:bg-gray-100 transition-colors"
                  role="option"
                  aria-selected={currentLanguage.code === lang.code}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-bold tracking-wider uppercase" style={{color: '#3c4161'}}>{lang.name}</span>
                  </div>
                  {currentLanguage.code === lang.code && (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;