import { graphqlClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS_BY_LANG } from "@/lib/queries-polylang";
import type { Post } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { Metadata } from "next";
import NewsPageClient from "@/components/news/NewsPageClient";
import { getUITranslations } from "@/lib/translations";

interface PostsResponse {
    posts: {
        nodes: Post[];
    };
}

async function getPosts(lang: Locale) {
    try {
        const data: PostsResponse = await graphqlClient.request(GET_ALL_POSTS_BY_LANG, {
            first: 50,
            language: lang.toUpperCase(),
        });

        return data.posts.nodes || [];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const t = getUITranslations(lang);

    return {
        title: `${t.news.title} - Takovoberry`,
        description: t.news.description,
    };
}

export default async function NewsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const posts = await getPosts(lang);

    return <NewsPageClient posts={posts} lang={lang} />;
}
