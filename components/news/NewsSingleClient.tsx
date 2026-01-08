"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { fadeIn, killAnimations } from "@/lib/animations";
import { getUITranslations } from "@/lib/translations";

interface NewsSingleClientProps {
    post: Post;
    lang: Locale;
}

function formatDate(dateString: string, dateLocale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function NewsSingleClient({ post, lang }: NewsSingleClientProps) {
    const heroRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);
    const t = getUITranslations(lang);

    useEffect(() => {
        const hero = heroRef.current;
        const image = imageRef.current;
        const content = contentRef.current;

        if (animationInitialized.current) return;
        animationInitialized.current = true;

        // Hero animations
        if (hero) {
            const backLink = hero.querySelector(".news-single__back");
            const meta = hero.querySelector(".news-single__meta");
            const title = hero.querySelector(".news-single__title");

            if (backLink) fadeIn(backLink, { delay: 0.1 });
            if (meta) fadeIn(meta, { delay: 0.2 });
            if (title) fadeIn(title, { delay: 0.3 });
        }

        // Featured image animation
        if (image) {
            const imageWrapper = image.querySelector(".news-single__image-wrapper");
            if (imageWrapper) fadeIn(imageWrapper, { delay: 0.4 });
        }

        // Content animation
        if (content) {
            const body = content.querySelector(".news-single__body");
            if (body) fadeIn(body, { delay: 0.5 });
        }

        return () => {
            if (hero) killAnimations(hero);
            if (image) killAnimations(image);
            if (content) killAnimations(content);
        };
    }, []);

    return (
        <main className="news-single">
            {/* Hero Section */}
            <section ref={heroRef} className="news-single__hero">
                <div className="container">
                    <div className="news-single__hero-content">
                        <Link href={`/${lang}/${t.news.newsRoute}`} className="news-single__back" data-animate>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t.news.backToNews}
                        </Link>

                        <div className="news-single__meta" data-animate>
                            <time className="news-single__date" dateTime={post.date}>
                                {formatDate(post.date, t.dateLocale)}
                            </time>
                            {post.categories?.nodes?.[0] && (
                                <span className="news-single__category">
                                    {post.categories.nodes[0].name}
                                </span>
                            )}
                            {post.readingTime && (
                                <span className="news-single__reading-time">
                                    {post.readingTime} {t.news.minRead}
                                </span>
                            )}
                        </div>

                        <h1 className="news-single__title" data-animate>{post.title}</h1>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {post.featuredImage?.node && (
                <section ref={imageRef} className="news-single__featured-image">
                    <div className="container">
                        <div className="news-single__image-wrapper" data-animate>
                            <Image
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.featuredImage.node.altText || post.title}
                                fill
                                style={{ objectFit: "cover" }}
                                priority
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Post Content */}
            <section ref={contentRef} className="news-single__content">
                <div className="container">
                    <article
                        className="news-single__body prose"
                        data-animate
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />
                </div>
            </section>

            {/* Back to News */}
            <section className="news-single__footer">
                <div className="container">
                    <Link href={`/${lang}/${t.news.newsRoute}`} className="news-single__back-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t.news.backToAllNews}
                    </Link>
                </div>
            </section>
        </main>
    );
}
