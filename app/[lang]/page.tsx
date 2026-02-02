import PageBuilder from "@/components/PageBuilder";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_PAGE_BY_SLUG } from "@/lib/queries-polylang";
import type { PageResponse } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.com';

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

// SEO metadata for homepage
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const title = lang === 'sr'
    ? 'Takovoberry - Regenerativna poljoprivreda u regionu Takovo'
    : 'Takovoberry - Regenerative Farming in Takovo Region';

  const description = lang === 'sr'
    ? 'Otkrijte regenerativne poljoprivredne prakse u regionu Takovo. Održiva proizvodnja bobičastog voća.'
    : 'Discover regenerative farming practices in the Takovo region. Sustainable berry production.';

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'en': `${SITE_URL}/en`,
        'sr': `${SITE_URL}/sr`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}`,
      siteName: 'Takovoberry',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
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
