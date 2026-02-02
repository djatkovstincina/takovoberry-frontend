'use client';

interface OrganizationJsonLdProps {
    name: string;
    url: string;
    logo?: string;
    description?: string;
}

interface ArticleJsonLdProps {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    image?: string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function OrganizationJsonLd({ name, url, logo, description }: OrganizationJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo,
        description,
        sameAs: [],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function ArticleJsonLd({
    title,
    description,
    url,
    datePublished,
    dateModified,
    authorName,
    image,
}: ArticleJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        author: authorName
            ? {
                '@type': 'Person',
                name: authorName,
            }
            : undefined,
        image: image || undefined,
        publisher: {
            '@type': 'Organization',
            name: 'Takovoberry',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.com',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function LocalBusinessJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.com',
        name: 'Takovoberry',
        description: 'Regenerative farming practices in Takovo region. Sustainable berry production.',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.com',
        address: {
            '@type': 'PostalAddress',
            addressRegion: 'Takovo',
            addressCountry: 'RS',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
