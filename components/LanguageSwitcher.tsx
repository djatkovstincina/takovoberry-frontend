'use client';

import Link from 'next/link';
import { i18n, type Locale } from '@/i18n-config';
import { useState, useRef, useEffect } from 'react';
import { useGlobalTranslations, getTranslatedPath } from '@/contexts/TranslationContext';

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const translationStore = useGlobalTranslations();

  const redirectedPathname = (locale: Locale) => {
    // Get translated path (returns homepage if no translation found)
    return getTranslatedPath(translationStore, locale);
  };

  const getLanguageLabel = (locale: Locale) => {
    return locale === 'en' ? 'English' : 'Srpski';
  };

  const getLanguageFlag = (locale: Locale) => {
    return locale === 'en' ? '🇬🇧' : '🇷🇸';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`language-switcher__button ${isOpen ? 'is-open' : ''}`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <svg
          className="language-switcher__arrow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="language-switcher__label">{currentLang.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="language-switcher__dropdown">
          {i18n.locales.map((locale) => {
            const isActive = currentLang === locale;
            return (
              <Link
                key={locale}
                href={redirectedPathname(locale)}
                onClick={() => setIsOpen(false)}
                className={`language-switcher__item ${isActive ? 'is-active' : ''}`}
              >
                <span className="language-switcher__flag">{getLanguageFlag(locale)}</span>
                <span className="language-switcher__name">{getLanguageLabel(locale)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
