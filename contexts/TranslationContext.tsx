'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from '@/i18n-config';
import { getUITranslations } from '@/lib/translations';

interface Translation {
    slug: string;
    uri?: string; // For pages, the full URI path
    language: {
        code: string;
    };
}

interface TranslationStore {
    translations: Translation[];
    basePath: string;
    type: 'post' | 'page';
}

// Global store for translations (persists across component tree)
let globalTranslationStore: TranslationStore | null = null;
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
}

function getSnapshot() {
    return globalTranslationStore;
}

export function setGlobalTranslations(translations: Translation[], basePath: string, type: 'post' | 'page' = 'post') {
    globalTranslationStore = { translations, basePath, type };
    listeners.forEach(listener => listener());
}

export function clearGlobalTranslations() {
    globalTranslationStore = null;
    listeners.forEach(listener => listener());
}

export function useGlobalTranslations() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Known homepage slugs
const HOMEPAGE_SLUGS = ['home', 'pocetna', 'početna', 'naslovna'];

// Known news listing slugs
const NEWS_LISTING_SLUGS = ['news', 'vesti', 'novosti'];

export function getTranslatedPath(
    store: TranslationStore | null,
    targetLang: Locale
): string {
    // If no translations available, go to homepage of target language
    if (!store || !store.translations || store.translations.length === 0) {
        return `/${targetLang}`;
    }

    const translation = store.translations.find(
        (t) => t.language.code.toLowerCase() === targetLang.toLowerCase()
    );

    // If no translation found for this language, go to homepage
    if (!translation) {
        return `/${targetLang}`;
    }

    if (store.type === 'page') {
        // Check if this is a homepage
        if (HOMEPAGE_SLUGS.includes(translation.slug.toLowerCase())) {
            return `/${targetLang}`;
        }

        // Check if this is a news listing page - use translated slug
        if (NEWS_LISTING_SLUGS.includes(translation.slug.toLowerCase()) && store.basePath === 'news') {
            return `/${targetLang}/${translation.slug}`;
        }

        // For regular pages, use the translated slug directly
        return `/${targetLang}/${translation.slug}`;
    }

    // For posts, use translated news section slug + translated post slug
    const t = getUITranslations(targetLang);
    return `/${targetLang}/${t.news.newsRoute}/${translation.slug}`;
}
