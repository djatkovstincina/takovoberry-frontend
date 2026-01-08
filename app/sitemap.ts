import { MetadataRoute } from 'next';
import { graphqlClient } from '@/lib/graphql-client';
import { i18n } from '@/i18n-config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.orbu.studio';

interface PageNode {
    slug: string;
    modified: string;
    language: {
        code: string;
    };
}

interface PostNode {
    slug: string;
    modified: string;
    language: {
        code: string;
    };
}

async function getPages(): Promise<PageNode[]> {
    const query = `
        query GetAllPagesForSitemap {
            pages(first: 100, where: { status: PUBLISH }) {
                nodes {
                    slug
                    modified
                    language {
                        code
                    }
                }
            }
        }
    `;

    try {
        const data = await graphqlClient.request<{ pages: { nodes: PageNode[] } }>(query);
        return data.pages.nodes || [];
    } catch {
        return [];
    }
}

async function getPosts(): Promise<PostNode[]> {
    const query = `
        query GetAllPostsForSitemap {
            posts(first: 100, where: { status: PUBLISH }) {
                nodes {
                    slug
                    modified
                    language {
                        code
                    }
                }
            }
        }
    `;

    try {
        const data = await graphqlClient.request<{ posts: { nodes: PostNode[] } }>(query);
        return data.posts.nodes || [];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pages = await getPages();
    const posts = await getPosts();

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add homepage for each language
    for (const locale of i18n.locales) {
        sitemapEntries.push({
            url: `${SITE_URL}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        });
    }

    // Add pages
    for (const page of pages) {
        // Skip homepage slugs
        if (page.slug === 'home' || page.slug === 'pocetna') continue;

        const lang = page.language.code.toLowerCase();
        sitemapEntries.push({
            url: `${SITE_URL}/${lang}/${page.slug}`,
            lastModified: new Date(page.modified),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    }

    // Add news listing pages
    sitemapEntries.push({
        url: `${SITE_URL}/en/news`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    });
    sitemapEntries.push({
        url: `${SITE_URL}/sr/vesti`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    });

    // Add posts
    for (const post of posts) {
        const lang = post.language.code.toLowerCase();
        const newsSlug = lang === 'sr' ? 'vesti' : 'news';
        sitemapEntries.push({
            url: `${SITE_URL}/${lang}/${newsSlug}/${post.slug}`,
            lastModified: new Date(post.modified),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    }

    return sitemapEntries;
}
