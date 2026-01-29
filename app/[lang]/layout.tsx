import type { Locale } from "@/i18n-config";
import { i18n } from "@/i18n-config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import HeaderAnimation from "@/components/HeaderAnimation";
import TranslationSync from "@/components/TranslationSync";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_FOOTER_SETTINGS } from "@/lib/queries-polylang";
import { FooterSettingsResponse } from "@/types/wordpress";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };

  // Fetch footer settings
  let footerSettings;
  try {
    const data = await graphqlClient.request<FooterSettingsResponse>(
      GET_FOOTER_SETTINGS
    );
    footerSettings = data.footerSettings;
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    // Fallback footer settings
    footerSettings = {
      copyright: "© 2026 Takovoberry. All rights reserved.",
      phone: undefined,
      email: undefined,
      facebookUrl: undefined,
      instagramUrl: undefined,
    };
  }

  return (
    <div>
      <LocalBusinessJsonLd />
      <TranslationSync />
      <HeaderAnimation />
      <StickyHeader />
      <Header lang={lang} />
      <main>
        {children}
      </main>
      <Footer settings={footerSettings} />
    </div>
  );
}
