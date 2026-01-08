import PageBuilder from "@/components/PageBuilder";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_PAGE_BY_SLUG } from "@/lib/queries-polylang";
import type { PageResponse } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";

export const revalidate = 60;

// Homepage slugs per language
const HOMEPAGE_SLUGS: Record<Locale, string> = {
  en: 'home',
  sr: 'pocetna',
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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const homepageSlug = HOMEPAGE_SLUGS[lang] || 'home';
  const pageData = await getPageData(homepageSlug, lang);

  return (
    <PageBuilder sections={pageData?.pageBuilder?.pageBuilder ?? []} />
  );
}
