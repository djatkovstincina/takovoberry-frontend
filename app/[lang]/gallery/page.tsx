import PageBuilder from "@/components/PageBuilder";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_PAGE_BY_SLUG } from "@/lib/queries-polylang";
import type { PageResponse } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";

export const revalidate = 60;

const GALLERY_SLUGS: Record<Locale, string> = {
    en: 'gallery',
    sr: 'galerija',
};

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

export default async function GalleryPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;

    const gallerySlug = GALLERY_SLUGS[lang] || 'gallery';
    const pageData = await getPageData(gallerySlug, lang);

    return (
        <PageBuilder sections={pageData?.pageBuilder?.pageBuilder ?? []} />
    );
}
