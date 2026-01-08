"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { AboutContentSection, HeadingBlock, TextBlock, FeaturesBlock } from "@/types/wordpress";
import { fadeIn, killAnimations, fallingElements } from "@/lib/animations";

interface AboutContentProps {
    data: AboutContentSection;
}

export default function AboutContent({ data }: AboutContentProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const animationInitialized = useRef(false);
    const cleanupFallingBlueberries = useRef<(() => void) | null>(null);

    const { beforeImage, afterImage, leavesImage, contentBlocks } = data;

    // Extract node data for easier access
    const beforeImageData = beforeImage?.node;
    const afterImageData = afterImage?.node;
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

                        const textContent = section.querySelector(".about-content__text");
                        const sliderWrapper = section.querySelector(".about-content__slider-wrapper");

                        // Fade in text content
                        fadeIn(textContent, { delay: 0.2 });
                        fadeIn(sliderWrapper, { delay: 0.3 });

                        // Add falling blueberries animation (right side only)
                        setTimeout(() => {
                            cleanupFallingBlueberries.current = fallingElements(section, {
                                imageSources: [
                                    "/blueberry.png",
                                    "/blueberry-1.png",
                                    "/blueberry-2.png",
                                    "/blueberry-3.png"
                                ],
                                imageSize: 30,
                                count: 3,
                                duration: { min: 14, max: 18 },
                                delay: { min: 0, max: 5 },
                                leftSide: false,
                                rightSide: true,
                            });
                        }, 1000);

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
            if (cleanupFallingBlueberries.current) {
                cleanupFallingBlueberries.current();
            }
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        // Clamp between 0 and 100
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
        setSliderPosition(clampedPercentage);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();

        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        // Clamp between 0 and 100
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
        setSliderPosition(clampedPercentage);
    };

    return (
        <section ref={sectionRef} className="about-content">
            <div className="container">
                <div className="about-content__container">
                    {/* Before/After Image Slider */}
                    {beforeImageData && afterImageData && (
                        <div className="about-content__slider-wrapper" data-animate>
                            {/* Leaves Background Image */}
                            {leavesImageData && (
                                <div className="about-content__leaves">
                                    <Image
                                        src={leavesImageData.sourceUrl}
                                        alt={leavesImageData.altText || "Leaves decoration"}
                                        fill
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                            )}

                            <div
                                ref={sliderRef}
                                className="about-content__slider"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* After Image (Background) */}
                                <div className="about-content__slider-image about-content__slider-image--after">
                                    <Image
                                        src={afterImageData.sourceUrl}
                                        alt={afterImageData.altText || "After"}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                {/* Before Image (Overlay with clip) */}
                                <div
                                    className="about-content__slider-image about-content__slider-image--before"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                >
                                    <Image
                                        src={beforeImageData.sourceUrl}
                                        alt={beforeImageData.altText || "Before"}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                {/* Slider Handle */}
                                <div
                                    className="about-content__slider-handle"
                                    style={{ left: `${sliderPosition}%` }}
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleTouchStart}
                                >
                                    <div className="about-content__slider-line"></div>
                                    <div className="about-content__slider-button">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Blocks */}
                    {contentBlocks && contentBlocks.length > 0 && (
                        <div className="about-content__text" data-animate>
                            {contentBlocks.map((block, index) => {
                                const typename = block.__typename || block.fieldGroupName;

                                // Heading Block
                                if (typename?.includes('Heading')) {
                                    const headingBlock = block as HeadingBlock;
                                    return (
                                        <div key={index} className="content-block content-block--heading">
                                            {headingBlock.tag && (
                                                <div className="content-block__tag">
                                                    {headingBlock.tag}
                                                    <svg className="content-block__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                                        <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                                    </svg>
                                                </div>
                                            )}
                                            <h2 className="content-block__title">{headingBlock.title}</h2>
                                        </div>
                                    );
                                }

                                // Text Block
                                if (typename?.includes('Text')) {
                                    const textBlock = block as TextBlock;
                                    return (
                                        <div key={index} className="content-block content-block--text">
                                            <p>{textBlock.text}</p>
                                        </div>
                                    );
                                }

                                // Features Block
                                if (typename?.includes('Features')) {
                                    const featuresBlock = block as FeaturesBlock;
                                    return (
                                        <div key={index} className="content-block content-block--features">
                                            <ul className="features-list">
                                                {featuresBlock.items?.map((item, i) => (
                                                    <li key={i} className="features-list__item">
                                                        {item.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
