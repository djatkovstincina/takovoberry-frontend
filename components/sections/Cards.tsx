"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { CardsSection } from "@/types/wordpress";
import { staggerFadeIn, levitatingElements, killAnimations } from "@/lib/animations";

interface CardsProps {
    data: CardsSection;
}

export default function Cards({ data }: CardsProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);
    const cleanupLevitatingBlueberries = useRef<(() => void) | null>(null);

    const { cards } = data;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Create Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        // Animate cards
                        const cardElements = section.querySelectorAll(".cards__card");
                        if (cardElements.length) {
                            staggerFadeIn(cardElements, { duration: 0.8, stagger: 0.2, y: 40 });
                        }

                        // Add levitating blueberries animation
                        setTimeout(() => {
                            if (section) {
                                cleanupLevitatingBlueberries.current = levitatingElements(section, {
                                    imageSources: [
                                        "/blueberry.png",
                                        "/blueberry-1.png",
                                        "/blueberry-2.png",
                                        "/blueberry-3.png"
                                    ],
                                    imageSize: 30,
                                    count: 6,
                                    leftSide: true,
                                    rightSide: true,
                                });
                            }
                        }, 1000);

                        // Disconnect observer after animations start
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: "0px",
            }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();

            // Cleanup levitating blueberries
            if (cleanupLevitatingBlueberries.current) {
                cleanupLevitatingBlueberries.current();
            }

            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    if (!cards || cards.length !== 3) {
        return null;
    }

    return (
        <section className="cards" ref={sectionRef}>
            <div className="container">
                <div className="cards__grid">
                    {/* First Card - Horizontal */}
                    <div className="cards__card cards__card--horizontal cards__card--1" data-animate>
                        <div className="cards__image-wrapper">
                            <Image
                                src={cards[0].image.node.sourceUrl}
                                alt={cards[0].image.node.altText || cards[0].title}
                                width={cards[0].image.node.mediaDetails?.width || 600}
                                height={cards[0].image.node.mediaDetails?.height || 400}
                                className="cards__image"
                            />
                        </div>
                        <div className="cards__content">
                            <div className="cards__icon-wrapper">
                                <Image
                                    src={cards[0].icon.node.sourceUrl}
                                    alt={cards[0].icon.node.altText || "Icon"}
                                    width={96}
                                    height={96}
                                    className="cards__icon"
                                />
                            </div>
                            <span className="cards__tag">
                                {cards[0].tag}
                                <svg className="cards__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </span>
                            <h3 className="cards__title">{cards[0].title}</h3>
                        </div>
                    </div>

                    {/* Second Card - Horizontal Reverse */}
                    <div className="cards__card cards__card--horizontal cards__card--reverse cards__card--2" data-animate>
                        <div className="cards__content">
                            <div className="cards__icon-wrapper">
                                <Image
                                    src={cards[1].icon.node.sourceUrl}
                                    alt={cards[1].icon.node.altText || "Icon"}
                                    width={96}
                                    height={96}
                                    className="cards__icon"
                                />
                            </div>
                            <span className="cards__tag">
                                {cards[1].tag}
                                <svg className="cards__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </span>
                            <h3 className="cards__title">{cards[1].title}</h3>
                        </div>
                        <div className="cards__image-wrapper">
                            <Image
                                src={cards[1].image.node.sourceUrl}
                                alt={cards[1].image.node.altText || cards[1].title}
                                width={cards[1].image.node.mediaDetails?.width || 600}
                                height={cards[1].image.node.mediaDetails?.height || 400}
                                className="cards__image"
                            />
                        </div>
                    </div>

                    {/* Third Card - Vertical */}
                    <div className="cards__card cards__card--vertical cards__card--3" data-animate>
                        <div className="cards__image-wrapper">
                            <Image
                                src={cards[2].image.node.sourceUrl}
                                alt={cards[2].image.node.altText || cards[2].title}
                                width={cards[2].image.node.mediaDetails?.width || 400}
                                height={cards[2].image.node.mediaDetails?.height || 600}
                                className="cards__image"
                            />
                        </div>
                        <div className="cards__content">
                            <div className="cards__icon-wrapper">
                                <Image
                                    src={cards[2].icon.node.sourceUrl}
                                    alt={cards[2].icon.node.altText || "Icon"}
                                    width={96}
                                    height={96}
                                    className="cards__icon"
                                />
                            </div>
                            <span className="cards__tag">
                                {cards[2].tag}
                                <svg className="cards__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </span>
                            <h3 className="cards__title">{cards[2].title}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
