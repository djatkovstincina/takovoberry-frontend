'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setGlobalTranslations, clearGlobalTranslations } from '@/contexts/TranslationContext';

interface PathInfo {
    type: 'post' | 'page';
    slug: string;
    nextRoute: string; // The Next.js route (without language prefix)
    isNewsListing?: boolean; // True for news listing page
}

function getPathInfo(pathname: string): PathInfo | null {
    if (!pathname) return null;

    // Remove leading slash and split
    const parts = pathname.replace(/^\//, '').split('/');

    // First part should be language code
    if (parts.length === 0) return null;

    const lang = parts[0];
    if (!['en', 'sr'].includes(lang)) return null;

    // Homepage: /en or /sr
    if (parts.length === 1) {
        return { type: 'page', slug: 'home', nextRoute: '' };
    }

    const section = parts[1];

    // News listing page: /en/news or /sr/news (or /sr/vesti)
    // This is the posts page set in WordPress Reading Settings
    if ((section === 'news' || section === 'vesti') && parts.length === 2) {
        return { type: 'page', slug: section, nextRoute: 'news', isNewsListing: true };
    }

    // Single post: /en/news/slug or /sr/news/slug (or /sr/vesti/slug)
    if ((section === 'news' || section === 'vesti') && parts.length === 3) {
        return { type: 'post', slug: parts[2], nextRoute: '/news' };
    }

    // Regular page: /en/about, /en/services, etc.
    // The section IS the Next.js route, use it as the WordPress slug too
    if (parts.length === 2) {
        return { type: 'page', slug: section, nextRoute: section };
    }

    return null;
}

export default function TranslationSync() {
    const pathname = usePathname();

    useEffect(() => {
        const pathInfo = getPathInfo(pathname || '');

        if (!pathInfo) {
            clearGlobalTranslations();
            return;
        }

        // Fetch translations from API
        const fetchTranslations = async () => {
            try {
                const isNewsListingParam = pathInfo.isNewsListing ? '&isNewsListing=true' : '';
                const response = await fetch(
                    `/api/translations?slug=${encodeURIComponent(pathInfo.slug)}&type=${pathInfo.type}&route=${encodeURIComponent(pathInfo.nextRoute)}${isNewsListingParam}`
                );
                const data = await response.json();

                if (data.translations && data.translations.length > 0) {
                    // For news listing, use 'news' as base path
                    // For homepage, use empty base path
                    // For other pages, use the Next.js route
                    // For posts, use the basePath from pathInfo
                    let basePath: string;
                    if (data.isNewsListing) {
                        basePath = 'news';
                    } else if (data.isHomepage) {
                        basePath = '';
                    } else if (pathInfo.type === 'page') {
                        basePath = pathInfo.nextRoute;
                    } else {
                        basePath = pathInfo.nextRoute;
                    }

                    setGlobalTranslations(
                        data.translations,
                        basePath,
                        data.type || pathInfo.type
                    );
                } else {
                    clearGlobalTranslations();
                }
            } catch (error) {
                console.error('Error fetching translations:', error);
                clearGlobalTranslations();
            }
        };

        fetchTranslations();

        // Cleanup on unmount or pathname change
        return () => {
            clearGlobalTranslations();
        };
    }, [pathname]);

    return null; // This component doesn't render anything
}
