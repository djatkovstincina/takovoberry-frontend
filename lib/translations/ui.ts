import type { Locale } from "@/i18n-config";

// General UI translations used across the site
export const uiTranslations = {
    en: {
        // Common
        common: {
            readMore: "Read more",
            backTo: "Back to",
            loading: "Loading...",
            error: "Error",
            close: "Close",
            open: "Open",
            menu: "Menu",
            search: "Search",
            home: "Home",
        },
        // Contact
        contact: {
            phone: "Phone",
            email: "Email",
        },
        // News
        news: {
            title: "News",
            tag: "Blog",
            description: "Latest news and updates from our blueberry farm.",
            latestNews: "Latest News",
            noArticles: "No news posts yet.",
            backToNews: "Back to news",
            backToAllNews: "Back to all news",
            readArticle: "Read Article",
            minRead: "min read",
            newsRoute: "news",
        },
        // Navigation
        nav: {
            home: "Home",
            about: "About",
            services: "Services",
            courses: "Courses",
            gallery: "Gallery",
            news: "News",
            contact: "Contact",
        },
        // Footer
        footer: {
            allRightsReserved: "All rights reserved.",
            privacyPolicy: "Privacy Policy",
            termsOfService: "Terms of Service",
        },
        // 404
        notFound: {
            title: "Page Not Found",
            description: "The page you are looking for does not exist.",
            backHome: "Back to Home",
        },
        // Date formatting
        dateLocale: "en-US",
    },
    sr: {
        // Common
        common: {
            readMore: "Pročitaj više",
            backTo: "Nazad na",
            loading: "Učitavanje...",
            error: "Greška",
            close: "Zatvori",
            open: "Otvori",
            menu: "Meni",
            search: "Pretraga",
            home: "Početna",
        },
        // Contact
        contact: {
            phone: "Telefon",
            email: "Email",
        },
        // News
        news: {
            title: "Vesti",
            tag: "Blog",
            description: "Najnovije vesti i ažuriranja sa naše farme borovnica.",
            latestNews: "Najnovije vesti",
            noArticles: "Nema objavljenih vesti.",
            backToNews: "Nazad na vesti",
            backToAllNews: "Nazad na sve vesti",
            readArticle: "Pročitaj članak",
            minRead: "min čitanja",
            newsRoute: "vesti",
        },
        // Navigation
        nav: {
            home: "Početna",
            about: "O nama",
            services: "Usluge",
            courses: "Kursevi",
            gallery: "Galerija",
            news: "Vesti",
            contact: "Kontakt",
        },
        // Footer
        footer: {
            allRightsReserved: "Sva prava zadržana.",
            privacyPolicy: "Politika privatnosti",
            termsOfService: "Uslovi korišćenja",
        },
        // 404
        notFound: {
            title: "Stranica nije pronađena",
            description: "Stranica koju tražite ne postoji.",
            backHome: "Nazad na početnu",
        },
        // Date formatting
        dateLocale: "sr-RS",
    },
};

export type UITranslations = typeof uiTranslations.en;

export function getUITranslations(locale: Locale): UITranslations {
    return uiTranslations[locale] || uiTranslations.en;
}

// Helper hook for client components
export function useTranslations(locale: Locale) {
    return getUITranslations(locale);
}
