"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function StickyHeader() {
    const pathname = usePathname();
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const header = document.querySelector(".site-header");
        if (!header) return;

        // Reset sticky state on route change
        header.classList.remove("is-sticky");

        // Clean up previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        // Small delay to ensure DOM is ready after navigation
        const timeoutId = setTimeout(() => {
            const heroSection = document.querySelector(".hero");

            // If no hero section on this page, use scroll-based sticky
            if (!heroSection) {
                const handleScroll = () => {
                    if (window.scrollY > 100) {
                        header.classList.add("is-sticky");
                    } else {
                        header.classList.remove("is-sticky");
                    }
                };

                // Check initial scroll position
                handleScroll();

                window.addEventListener("scroll", handleScroll, { passive: true });

                // Store cleanup in ref-like pattern
                observerRef.current = {
                    disconnect: () => window.removeEventListener("scroll", handleScroll)
                } as IntersectionObserver;

                return;
            }

            // Hero section exists - use intersection observer
            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) {
                        header.classList.add("is-sticky");
                    } else {
                        header.classList.remove("is-sticky");
                    }
                },
                {
                    threshold: 0,
                    rootMargin: "-1px 0px 0px 0px",
                }
            );

            observerRef.current.observe(heroSection);
        }, 50);

        return () => {
            clearTimeout(timeoutId);
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [pathname]);

    return null;
}
