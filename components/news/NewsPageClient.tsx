"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { fadeIn, staggerFadeIn, killAnimations } from "@/lib/animations";
import { getUITranslations } from "@/lib/translations";

interface NewsPageClientProps {
    posts: Post[];
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

export default function NewsPageClient({ posts, lang }: NewsPageClientProps) {
    const t = getUITranslations(lang);
    const heroRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const heroAnimationInitialized = useRef(false);
    const contentAnimationInitialized = useRef(false);

    // Hero animations
    useEffect(() => {
        const section = heroRef.current;
        if (!section || heroAnimationInitialized.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !heroAnimationInitialized.current) {
                        heroAnimationInitialized.current = true;

                        const tag = section.querySelector(".news-page__tag");
                        const title = section.querySelector(".news-page__title");
                        const description = section.querySelector(".news-page__description");

                        if (tag) fadeIn(tag, { delay: 0.1 });
                        if (title) fadeIn(title, { delay: 0.2 });
                        if (description) fadeIn(description, { delay: 0.3 });

                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    // Content animations
    useEffect(() => {
        const section = contentRef.current;
        if (!section || contentAnimationInitialized.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !contentAnimationInitialized.current) {
                        contentAnimationInitialized.current = true;

                        const cards = section.querySelectorAll(".news-card");
                        if (cards.length) {
                            staggerFadeIn(cards, { stagger: 0.1, y: 30 });
                        }

                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    return (
        <main className="news-page">
            {/* Page Hero */}
            <section ref={heroRef} className="news-page__hero">
                <div className="container">
                    <div className="news-page__hero-content">
                        <div className="news-page__tag" data-animate>
                            {t.news.tag}
                            <svg className="news-page__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                            </svg>
                        </div>
                        <h1 className="news-page__title" data-animate>
                            {t.news.title}
                        </h1>
                        <p className="news-page__description" data-animate>
                            {t.news.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section ref={contentRef} className="news-page__content">
                <div className="container">
                    {posts.length > 0 ? (
                        <div className="news-page__grid">
                            {posts.map((post) => (
                                <article key={post.id} className="news-card" data-animate>
                                    <Link href={`/${lang}/${t.news.newsRoute}/${post.slug}`} className="news-card__link">
                                        <div className="news-card__image">
                                            {post.featuredImage?.node ? (
                                                <Image
                                                    src={post.featuredImage.node.sourceUrl}
                                                    alt={post.featuredImage.node.altText || post.title}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="news-card__placeholder">
                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <polyline points="21,15 16,10 5,21" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="news-card__content">
                                            <div className="news-card__meta">
                                                <time className="news-card__date" dateTime={post.date}>
                                                    {formatDate(post.date, t.dateLocale)}
                                                </time>
                                                {post.categories?.nodes?.[0] && (
                                                    <span className="news-card__category">
                                                        {post.categories.nodes[0].name}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="news-card__title">{post.title}</h2>
                                            {post.excerpt && (
                                                <div
                                                    className="news-card__excerpt"
                                                    dangerouslySetInnerHTML={{
                                                        __html: post.excerpt.length > 170
                                                            ? post.excerpt.substring(0, 170).replace(/<[^>]*$/, '') + '...'
                                                            : post.excerpt
                                                    }}
                                                />
                                            )}
                                            <span className="news-card__read-more">
                                                {t.common.readMore}
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="news-page__empty">
                            <p>{t.news.noArticles}</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
