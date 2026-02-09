"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { OurApproachSection } from "@/types/wordpress";
import { fadeIn, staggerFadeIn, circularFloating, scaleOnHover, killAnimations, fallingElements } from "@/lib/animations";

interface OurApproachProps {
    data: OurApproachSection;
}

export default function OurApproach({ data }: OurApproachProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);
    const cleanupFallingBlueberries = useRef<(() => void) | null>(null);
    const {
        tag,
        title,
        description,
        points,
        badgeText,
        images,
        leavesImage,
    } = data;

    const leavesImageData = leavesImage?.node;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Create Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        // Animate content
                        const approachTag = section.querySelector(".our-approach__tag");
                        const approachTitle = section.querySelector(".our-approach__title");
                        const approachDesc = section.querySelector(".our-approach__description");
                        const approachPoints = section.querySelectorAll(".our-approach__point");
                        const approachBadge = section.querySelector(".our-approach__badge");

                        if (approachTag) fadeIn(approachTag, { duration: 0.8, delay: 0.2, y: 20 });
                        if (approachTitle) fadeIn(approachTitle, { duration: 0.8, delay: 0.3, y: 20 });
                        if (approachDesc) fadeIn(approachDesc, { duration: 0.8, delay: 0.4, y: 20 });
                        if (approachPoints.length) staggerFadeIn(approachPoints, { duration: 0.6, stagger: 0.1, y: 20 });
                        if (approachBadge) fadeIn(approachBadge, { duration: 0.8, delay: 0.6, y: 20 });

                        // Animate images with fade in first
                        const imageElements = section.querySelectorAll(".our-approach__image-wrapper");
                        if (imageElements.length) staggerFadeIn(imageElements, { duration: 0.8, stagger: 0.2, y: 30 });

                        // Add floating animation to both circular images
                        const leftImage = section.querySelector(".our-approach__image-wrapper--left") as HTMLElement;
                        const rightImage = section.querySelector(".our-approach__image-wrapper--right") as HTMLElement;

                        if (leftImage) {
                            // Add floating with slight delay using setTimeout
                            setTimeout(() => {
                                circularFloating(leftImage, {
                                    radius: 8,
                                    duration: 30,
                                    shape: "triangle",
                                    rotation: false,
                                });
                            }, 800);
                            scaleOnHover(leftImage, 1.05);
                        }

                        if (rightImage) {
                            // Add floating with slight delay using setTimeout
                            setTimeout(() => {
                                circularFloating(rightImage, {
                                    radius: 20,
                                    duration: 40,
                                    shape: "triangle",
                                    rotation: false,
                                });
                            }, 800);
                            scaleOnHover(rightImage, 1.05);
                        }

                        // Add falling blueberries animation
                        setTimeout(() => {
                            if (section) {
                                cleanupFallingBlueberries.current = fallingElements(section, {
                                    imageSources: [
                                        "/blueberry.png",
                                        "/blueberry-1.png",
                                        "/blueberry-2.png",
                                        "/blueberry-3.png"
                                    ],
                                    imageSize: 30,
                                    count: 2,
                                    duration: { min: 4, max: 8 },
                                    delay: { min: 0, max: 5 },
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
                threshold: 0.2, // Trigger when 20% of the section is visible
                rootMargin: "0px",
            }
        );

        // Start observing
        observer.observe(section);

        // Cleanup function
        return () => {
            observer.disconnect();
            const leftImage = section.querySelector(".our-approach__image-wrapper--left") as HTMLElement;
            const rightImage = section.querySelector(".our-approach__image-wrapper--right") as HTMLElement;
            if (leftImage) killAnimations(leftImage);
            if (rightImage) killAnimations(rightImage);

            // Cleanup falling blueberries
            if (cleanupFallingBlueberries.current) {
                cleanupFallingBlueberries.current();
            }
        };
    }, []);

    return (
        <section className="our-approach" ref={sectionRef}>
            <div className="container">
                <div className="our-approach__grid">
                    {/* Left Column - Images */}
                    <div className="our-approach__images">
                        {images && images.nodes && images.nodes.length >= 2 && (
                            <>
                                <div className="our-approach__image-wrapper our-approach__image-wrapper--left" data-animate>
                                    <Image
                                        src={images.nodes[0].sourceUrl}
                                        alt={images.nodes[0].altText || "Blueberry cultivation"}
                                        width={images.nodes[0].mediaDetails?.width || 300}
                                        height={images.nodes[0].mediaDetails?.height || 300}
                                        className="our-approach__image"
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                        quality={75}
                                    />
                                </div>
                                <div className="our-approach__image-wrapper our-approach__image-wrapper--right" data-animate>
                                    <Image
                                        src={images.nodes[1].sourceUrl}
                                        alt={images.nodes[1].altText || "Blueberry cultivation"}
                                        width={images.nodes[1].mediaDetails?.width || 500}
                                        height={images.nodes[1].mediaDetails?.height || 500}
                                        className="our-approach__image"
                                        loading="lazy"
                                        sizes="(max-width: 768px) 100vw, 440px"
                                        quality={75}
                                    />
                                </div>
                            </>
                        )}

                        {/* Leaves Background */}
                        {leavesImageData && (
                            <Image
                                src={leavesImageData.sourceUrl}
                                alt={leavesImageData.altText || "Leaves decoration"}
                                width={leavesImageData.mediaDetails?.width || 200}
                                height={leavesImageData.mediaDetails?.height || 200}
                                className="our-approach__leaves"
                                loading="lazy"
                                sizes="350px"
                                quality={70}
                            />
                        )}
                    </div>

                    {/* Right Column - Content */}
                    <div className="our-approach__content">
                        {tag && (
                            <span className="our-approach__tag" data-animate>
                                {tag}
                                <svg className="our-approach__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </span>
                        )}

                        <h2 className="our-approach__title" data-animate>{title}</h2>

                        {description && (
                            <p className="our-approach__description" data-animate>{description}</p>
                        )}

                        <div className="our-approach__additional">
                            {points && points.length > 0 && (
                                <ul className="our-approach__points">
                                    {points.map((point, index) => (
                                        <li key={index} className="our-approach__point" data-animate>
                                            {point.text}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {badgeText && (
                                <div className="our-approach__badge" data-animate>
                                    <div className="our-approach__badge-circle">100%</div>
                                    <span className="our-approach__badge-text">{badgeText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
