"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { CoursesContentSection } from "@/types/wordpress";
import { staggerFadeIn, killAnimations, fallingElements } from "@/lib/animations";

interface CoursesContentProps {
    data: CoursesContentSection;
}

export default function CoursesContent({ data }: CoursesContentProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);
    const cleanupFallingBlueberries = useRef<(() => void) | null>(null);

    const { rows } = data;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Create Intersection Observer for animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        // Stagger fade in all course rows
                        const courseRows = section.querySelectorAll(".courses-content__row");
                        staggerFadeIn(courseRows, { stagger: 0.2, y: 40 });

                        // Add falling blueberries animation (both sides)
                        setTimeout(() => {
                            cleanupFallingBlueberries.current = fallingElements(section, {
                                imageSources: [
                                    "/blueberry.png",
                                    "/blueberry-1.png",
                                    "/blueberry-2.png",
                                    "/blueberry-3.png"
                                ],
                                imageSize: 30,
                                count: 4,
                                duration: { min: 10, max: 16 },
                                delay: { min: 0, max: 5 },
                                leftSide: true,
                                rightSide: true,
                            });
                        }, 500);

                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        observer.observe(section);

        // Cleanup
        return () => {
            observer.disconnect();
            if (cleanupFallingBlueberries.current) {
                cleanupFallingBlueberries.current();
            }
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    if (!rows || rows.length === 0) {
        return null;
    }

    return (
        <section ref={sectionRef} className="courses-content">
            <div className="container">
                <div className="courses-content__rows">
                    {rows.map((row, index) => {
                        const isReversed = index % 2 !== 0;
                        const imageData = row.image?.node;

                        return (
                            <div
                                key={index}
                                className={`courses-content__row ${isReversed ? 'courses-content__row--reversed' : ''}`}
                                data-animate
                            >
                                {/* Image */}
                                <div className="courses-content__image-wrapper">
                                    {imageData && (
                                        <Image
                                            src={imageData.sourceUrl}
                                            alt={imageData.altText || row.title}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="courses-content__image"
                                            loading="lazy"
                                        />
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="courses-content__text">
                                    {row.tag && (
                                        <div className="courses-content__tag">
                                            {row.tag}
                                            <svg className="courses-content__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                                <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                            </svg>
                                        </div>
                                    )}
                                    <h2 className="courses-content__title">{row.title}</h2>
                                    <p className="courses-content__description">{row.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
