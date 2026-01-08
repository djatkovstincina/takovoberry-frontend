"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { PageHeroSection } from "@/types/wordpress";
import { fadeIn, killAnimations } from "@/lib/animations";

interface PageHeroProps {
    data: PageHeroSection;
}

export default function PageHero({ data }: PageHeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);

    const { tag, title, blueberriesImage } = data;

    // Extract node data for easier access
    const blueberriesImageData = blueberriesImage?.node;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Create Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        const heroTag = section.querySelector(".page-hero__tag");
                        const heroTitle = section.querySelector(".page-hero__title");

                        // Stagger fade in animations
                        fadeIn(heroTag, { delay: 0.2 });
                        fadeIn(heroTitle, { delay: 0.4 });

                        // Disconnect observer after animations start
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(section);

        // Cleanup
        return () => {
            observer.disconnect();
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="page-hero">
            <div className="container">
                <div className="page-hero__container">
                    <div className="page-hero__content">
                        {tag && (
                            <div className="page-hero__tag">
                                {tag}
                                <svg className="page-hero__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </div>
                        )}
                        {title && (
                            <h1 className="page-hero__title">{title}</h1>
                        )}
                    </div>

                    {blueberriesImageData && (
                        <div className="page-hero__image">
                            <Image
                                src={blueberriesImageData.sourceUrl}
                                alt={blueberriesImageData.altText || "Blueberries"}
                                width={blueberriesImageData.mediaDetails?.width || 600}
                                height={blueberriesImageData.mediaDetails?.height || 400}
                                priority
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
