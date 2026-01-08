import { graphqlClient } from "@/lib/graphql-client";
import { GET_POST_BY_SLUG_AND_LANG } from "@/lib/queries-polylang";
import type { Post } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsSingleClient from "@/components/news/NewsSingleClient";
import { getUITranslations } from "@/lib/translations";

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

    return {
        title: `${post.title} - Takovoberry`,
        description: post.seoMetaDescription || post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160),
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

    return <NewsSingleClient post={post} lang={lang} />;
}
