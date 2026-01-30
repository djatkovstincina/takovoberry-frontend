"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { HeroSection } from "@/types/wordpress";
import VideoPlayer from "@/components/VideoPlayer";
import { circularFloating, fadeIn, killAnimations } from "@/lib/animations";

interface HeroProps {
    data: HeroSection;
}

export default function Hero({ data }: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);

    const {
        tag,
        title,
        description,
        video,
        backgroundImage,
    } = data;

    // Extract node data for easier access
    const videoData = video?.node;
    const backgroundImageData = backgroundImage?.node;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Create Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        const backgroundImage = section.querySelector(".hero__background-image");
                        const heroTag = section.querySelector(".hero__tag");
                        const heroTitle = section.querySelector(".hero__title");
                        const heroDescription = section.querySelector(".hero__description");
                        const heroVideo = section.querySelector(".hero__video");
                        const heroLeaves = section.querySelector(".hero__background-image");

                        // Floating animation for background image
                        if (backgroundImage) {
                            circularFloating(backgroundImage, {
                                radius: 16,
                                duration: 50,
                                shape: "triangle",
                                rotation: false,
                            });
                        }

                        // Fade in animations for content elements
                        if (heroTag) {
                            fadeIn(heroTag, {
                                duration: 1,
                                delay: 0.1,
                                ease: "power2.out",
                                y: 20
                            });
                        }

                        if (heroTitle) {
                            fadeIn(heroTitle, {
                                duration: 1,
                                delay: 0.2,
                                ease: "power2.out",
                                y: 20
                            });
                        }

                        if (heroDescription) {
                            fadeIn(heroDescription, {
                                duration: 1,
                                delay: 0.3,
                                ease: "power2.out",
                                y: 20
                            });
                        }

                        if (heroVideo) {
                            fadeIn(heroVideo, {
                                duration: 1,
                                delay: 0.1,
                                ease: "power2.out",
                                y: 20
                            });
                        }

                        if (heroLeaves) {
                            fadeIn(heroLeaves, {
                                duration: 1,
                                delay: 0.5,
                                ease: "power2.out",
                                y: 0
                            });
                        }

                        // Disconnect observer after animations start
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the section is visible (hero is usually at top)
                rootMargin: "0px",
            }
        );

        // Start observing
        observer.observe(section);

        // Cleanup function
        return () => {
            observer.disconnect();
            const backgroundImage = section.querySelector(".hero__background-image");
            const heroTag = section.querySelector(".hero__tag");
            const heroTitle = section.querySelector(".hero__title");
            const heroDescription = section.querySelector(".hero__description");
            const heroVideo = section.querySelector(".hero__video");
            const heroLeaves = section.querySelector(".hero__background-image");

            if (backgroundImage) killAnimations(backgroundImage);
            if (heroTag) killAnimations(heroTag);
            if (heroTitle) killAnimations(heroTitle);
            if (heroDescription) killAnimations(heroDescription);
            if (heroVideo) killAnimations(heroVideo);
            if (heroLeaves) killAnimations(heroLeaves);
        };
    }, []);

    return (
        <section className="hero" ref={sectionRef}>
            <div className="container hero__container">

                <div className="hero__content">
                    {tag && (
                        <span className="hero__tag" data-animate>
                            {tag}
                            <svg className="hero__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                            </svg>
                        </span>
                    )}

                    <h1 className="hero__title" data-animate>{title}</h1>

                    {description && (
                        <p className="hero__description" data-animate>{description}</p>
                    )}
                </div>


                <div className="hero__media">
                    {backgroundImageData && (
                        <Image
                            src={backgroundImageData.sourceUrl}
                            alt={backgroundImageData.altText || "Blueberries"}
                            width={backgroundImageData.mediaDetails?.width || 800}
                            height={backgroundImageData.mediaDetails?.height || 800}
                            className="hero__background-image"
                            priority
                            fetchPriority="high"
                        />
                    )}

                    {videoData && (
                        <div className="hero__video" data-animate>
                            <VideoPlayer
                                src={videoData.mediaItemUrl}
                                type={videoData.mimeType || "video/mp4"}
                                autoPlay={true}
                                loop={true}
                                muted={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
