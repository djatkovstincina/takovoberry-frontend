"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n-config";
import { getUITranslations } from "@/lib/translations";
import { fadeIn } from "@/lib/animations";

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationInitialized = useRef(false);
    const params = useParams();
    const lang = (params?.lang as Locale) || "en";
    const t = getUITranslations(lang);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || animationInitialized.current) return;

        animationInitialized.current = true;

        const elements = container.querySelectorAll("[data-animate]");
        elements.forEach((el, index) => {
            fadeIn(el, { delay: 0.1 + index * 0.15, y: 30 });
        });
    }, []);

    return (
        <section className="not-found">
            <div className="not-found__background">
                {/* Decorative blueberry leaves */}
                <div className="not-found__leaf not-found__leaf--1" />
                <div className="not-found__leaf not-found__leaf--2" />
                <div className="not-found__leaf not-found__leaf--3" />
            </div>

            <div className="container">
                <div ref={containerRef} className="not-found__content">
                    {/* 404 Number */}
                    <div className="not-found__number" data-animate>
                        <span className="not-found__digit">4</span>
                        <span className="not-found__digit">0</span>
                        <span className="not-found__digit">4</span>
                    </div>

                    {/* Title */}
                    <h1 className="not-found__title" data-animate>
                        {t.notFound.title}
                    </h1>

                    {/* Description */}
                    <p className="not-found__description" data-animate>
                        {t.notFound.description}
                    </p>

                    {/* Back Home Button */}
                    <Link href={`/${lang}`} className="not-found__button" data-animate>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="not-found__button-icon"
                        >
                            <path
                                d="M15 10H5M5 10L9 6M5 10L9 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {t.notFound.backHome}
                    </Link>
                </div>
            </div>
        </section>
    );
}
