import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/graphql-client';

// Query to get translations for a post by slug
const GET_POST_TRANSLATIONS = `
  query GetPostTranslations($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      language { code }
      translations {
        slug
        language { code }
      }
    }
  }
`;

// Query to get translations for a page by slug
const GET_PAGE_TRANSLATIONS = `
  query GetPageTranslations($slug: ID!) {
    page(id: $slug, idType: URI) {
      slug
      uri
      language { code }
      translations {
        slug
        uri
        language { code }
      }
    }
  }
`;

interface TranslationResponse {
    post?: {
        slug: string;
        language: { code: string };
        translations: Array<{ slug: string; language: { code: string } }>;
    };
    page?: {
        slug: string;
        uri: string;
        language: { code: string };
        translations: Array<{ slug: string; uri: string; language: { code: string } }>;
    };
}

// Map of known homepage slugs to identify homepage
const HOMEPAGE_SLUGS = ['home', 'pocetna', 'početna'];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'post';
    const nextRoute = searchParams.get('route') || ''; // The Next.js route
    const isNewsListing = searchParams.get('isNewsListing') === 'true';

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        // Handle news listing page specially
        if (isNewsListing) {
            // For news listing, we create static translations based on known slugs
            // Since it's not a regular WordPress page but the "posts page"
            const translations = [
                { slug: 'news', language: { code: 'EN' } },
                { slug: 'vesti', language: { code: 'SR' } },
            ];
            
            return NextResponse.json({
                translations,
                type: 'page',
                isNewsListing: true,
                nextRoute: 'news'
            });
        }

        const query = type === 'page' ? GET_PAGE_TRANSLATIONS : GET_POST_TRANSLATIONS;
        const data: TranslationResponse = await graphqlClient.request(query, { slug });

        const item = type === 'page' ? data.page : data.post;

        if (!item) {
            return NextResponse.json({ translations: [], nextRoute });
        }

        if (type === 'page') {
            const page = data.page!;
            
            // Check if this is a homepage
            const isHomepage = HOMEPAGE_SLUGS.includes(page.slug.toLowerCase()) ||
                              page.uri === '/' ||
                              page.translations?.some(t => HOMEPAGE_SLUGS.includes(t.slug.toLowerCase()));
            
            const allTranslations = [
                { slug: page.slug, uri: page.uri, language: page.language },
                ...(page.translations || []),
            ];
            
            return NextResponse.json({ 
                translations: allTranslations, 
                type: 'page',
                isHomepage,
                nextRoute: isHomepage ? '' : nextRoute
            });
        } else {
            const post = data.post!;
            const allTranslations = [
                { slug: post.slug, language: post.language },
                ...(post.translations || []),
            ];
            return NextResponse.json({ 
                translations: allTranslations, 
                type: 'post',
                nextRoute
            });
        }
    } catch (error) {
        console.error('Error fetching translations:', error);
        return NextResponse.json({ translations: [], nextRoute });
    }
}
