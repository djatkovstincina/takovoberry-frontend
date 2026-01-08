import PageBuilder from "@/components/PageBuilder";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_PAGE_BY_SLUG } from "@/lib/queries-polylang";
import type { PageResponse } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUITranslations } from "@/lib/translations";

// List of reserved routes that have their own page files
const RESERVED_ROUTES = ['news', 'vesti'];

async function getPageData(slug: string, lang: Locale) {
    try {
        const data: PageResponse = await graphqlClient.request(GET_PAGE_BY_SLUG, {
            slug,
            language: lang.toUpperCase(),
        });

        return data.pages.nodes[0] || null;
    } catch (error) {
        console.error("Error fetching page data:", error);
        return null;
    }
}

// Generate static params for all pages in all languages
export async function generateStaticParams() {
    const GET_ALL_PAGES = `
        query GetAllPages {
            pages(first: 100, where: { status: PUBLISH }) {
                nodes {
                    slug
                    language {
                        code
                    }
                }
            }
        }
    `;

    try {
        const data = await graphqlClient.request<{
            pages: { nodes: Array<{ slug: string; language: { code: string } }> };
        }>(GET_ALL_PAGES);

        const params: Array<{ lang: Locale; slug: string }> = [];

        for (const page of data.pages.nodes) {
            // Skip reserved routes and homepage
            if (RESERVED_ROUTES.includes(page.slug) ||
                page.slug === 'home' ||
                page.slug === 'pocetna') {
                continue;
            }

            const lang = page.language.code.toLowerCase() as Locale;
            params.push({ lang, slug: page.slug });
        }

        return params;
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
    const { lang, slug } = await params;
    const t = getUITranslations(lang);

    // Skip reserved routes
    if (RESERVED_ROUTES.includes(slug)) {
        return {};
    }

    const pageData = await getPageData(slug, lang);

    if (!pageData) {
        return {
            title: `${t.notFound.title} - Takovoberry`,
        };
    }

    return {
        title: `${pageData.title} - Takovoberry`,
        description: `${pageData.title} - Takovoberry`,
    };
}

export default async function DynamicPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const { lang, slug } = await params;

    // Skip reserved routes - they have their own handlers
    if (RESERVED_ROUTES.includes(slug)) {
        notFound();
    }

    const pageData = await getPageData(slug, lang);

    if (!pageData) {
        notFound();
    }

    return (
        <PageBuilder sections={pageData?.pageBuilder?.pageBuilder ?? []} />
    );
}
