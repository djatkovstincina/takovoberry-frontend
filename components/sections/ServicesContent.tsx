"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import type { ServicesContentSection, HeadingBlock, TextBlock, FeaturesBlock } from "@/types/wordpress";
import { fadeIn, killAnimations, fallingElements } from "@/lib/animations";

interface ServicesContentProps {
    data: ServicesContentSection;
}

// Helper function to generate anchor ID from title
function generateAnchorId(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function ServicesContent({ data }: ServicesContentProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeAnchor, setActiveAnchor] = useState<string>('');
    const animationInitialized = useRef(false);
    const cleanupFallingBlueberries = useRef<(() => void) | null>(null);

    const { contentBlocks, leavesImage } = data;
    const leavesImageData = leavesImage?.node;

    // Extract heading titles for navigation - memoized to prevent unnecessary re-renders
    const headings = useMemo(() => {
        return contentBlocks?.filter(block => {
            const typename = block.__typename || block.fieldGroupName;
            return typename?.includes('Heading');
        }).map(block => {
            const headingBlock = block as HeadingBlock;
            return {
                title: headingBlock.title,
                id: generateAnchorId(headingBlock.title)
            };
        }) || [];
    }, [contentBlocks]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Create Intersection Observer for animations
        const animObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        const sidebar = section.querySelector(".services-content__sidebar-wrapper");
                        const textContent = section.querySelector(".services-content__text");

                        // Fade in sidebar and text content
                        fadeIn(sidebar, { delay: 0.1 });
                        fadeIn(textContent, { delay: 0.2 });

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

                        animObserver.disconnect();
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        animObserver.observe(section);

        // Cleanup
        return () => {
            animObserver.disconnect();
            if (cleanupFallingBlueberries.current) {
                cleanupFallingBlueberries.current();
            }
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    // Set up intersection observer for active heading tracking
    useEffect(() => {
        if (headings.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveAnchor(entry.target.id);
                }
            });
        }, observerOptions);

        // Observe all heading elements
        headings.forEach(heading => {
            const element = document.getElementById(heading.id);
            if (element) {
                headingObserver.observe(element);
            }
        });

        return () => {
            headingObserver.disconnect();
        };
    }, [headings]);

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 128; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveAnchor(id);
        }
    };

    return (
        <section ref={sectionRef} className="services-content">
            <div className="container">
                <div className="services-content__container">
                    {/* Sticky Sidebar with Navigation and Leaves */}
                    {headings.length > 0 && (
                        <div className="services-content__sidebar-wrapper" data-animate>
                            {/* Leaves Image Behind Sidebar */}
                            {leavesImageData && (
                                <div className="services-content__leaves">
                                    <Image
                                        src={leavesImageData.sourceUrl}
                                        alt={leavesImageData.altText || "Decorative leaves"}
                                        width={400}
                                        height={300}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}

                            <nav className="services-content__nav">
                                <ul className="services-content__nav-list">
                                    {headings.map((heading, index) => (
                                        <li key={index} className="services-content__nav-item">
                                            <a
                                                href={`#${heading.id}`}
                                                className={`services-content__nav-link ${activeAnchor === heading.id ? 'services-content__nav-link--active' : ''}`}
                                                onClick={(e) => handleAnchorClick(e, heading.id)}
                                            >
                                                {heading.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}

                    {/* Content Blocks */}
                    {contentBlocks && contentBlocks.length > 0 && (
                        <div className="services-content__text" data-animate>
                            {contentBlocks.map((block, index) => {
                                const typename = block.__typename || block.fieldGroupName;

                                // Heading Block
                                if (typename?.includes('Heading')) {
                                    const headingBlock = block as HeadingBlock;
                                    const anchorId = generateAnchorId(headingBlock.title);
                                    return (
                                        <div
                                            key={index}
                                            id={anchorId}
                                            className="content-block content-block--heading"
                                        >
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
