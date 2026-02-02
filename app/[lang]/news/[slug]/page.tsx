import { graphqlClient } from "@/lib/graphql-client";
import { GET_POST_BY_SLUG_AND_LANG } from "@/lib/queries-polylang";
import type { Post } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsSingleClient from "@/components/news/NewsSingleClient";
import { getUITranslations } from "@/lib/translations";
import { ArticleJsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.com';

interface PostResponse {
    post: Post;
}

async function getPost(slug: string) {
    try {
        const data: PostResponse = await graphqlClient.request(GET_POST_BY_SLUG_AND_LANG, {
            slug,
        });

        return data.post || null;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = await getPost(slug);
    const t = getUITranslations(lang);

    if (!post) {
        return {
            title: `${t.notFound.title} - Takovoberry`,
        };
    }

    const description = post.seoMetaDescription || post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || '';
    const newsSlug = lang === 'sr' ? 'vesti' : 'news';
    const url = `${SITE_URL}/${lang}/${newsSlug}/${slug}`;

    // Get alternate language URL
    const altLang = lang === 'sr' ? 'en' : 'sr';
    const altNewsSlug = altLang === 'sr' ? 'vesti' : 'news';
    const altSlug = post.translations?.[0]?.slug || slug;

    return {
        title: `${post.title} - Takovoberry`,
        description,
        alternates: {
            canonical: url,
            languages: {
                [lang]: url,
                [altLang]: `${SITE_URL}/${altLang}/${altNewsSlug}/${altSlug}`,
            },
        },
        openGraph: {
            title: post.title,
            description,
            url,
            siteName: 'Takovoberry',
            locale: lang === 'sr' ? 'sr_RS' : 'en_US',
            type: 'article',
            publishedTime: post.date,
            modifiedTime: post.modified,
            authors: post.author?.node?.name ? [post.author.node.name] : undefined,
            images: post.featuredImage?.node?.sourceUrl ? [
                {
                    url: post.featuredImage.node.sourceUrl,
                    alt: post.featuredImage.node.altText || post.title,
                    width: post.featuredImage.node.mediaDetails?.width,
                    height: post.featuredImage.node.mediaDetails?.height,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : undefined,
        },
    };
}

export default async function NewsPostPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const { lang, slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const newsSlug = lang === 'sr' ? 'vesti' : 'news';
    const url = `${SITE_URL}/${lang}/${newsSlug}/${slug}`;
    const description = post.seoMetaDescription || post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || '';

    return (
        <>
            <ArticleJsonLd
                title={post.title}
                description={description}
                url={url}
                datePublished={post.date}
                dateModified={post.modified}
                authorName={post.author?.node?.name}
                image={post.featuredImage?.node?.sourceUrl}
            />
            <NewsSingleClient post={post} lang={lang} />
        </>
    );
}
