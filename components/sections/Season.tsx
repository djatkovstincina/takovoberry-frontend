"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SeasonSection } from "@/types/wordpress";
import { fadeIn, staggerFadeIn, killAnimations } from "@/lib/animations";

interface SeasonProps {
    data: SeasonSection;
}

interface Hotspot {
    title: string;
    description: string;
    positionX: number;
    positionY: number;
}

const MONTHS = [
    { value: 'january', label: 'Jan' },
    { value: 'february', label: 'Feb' },
    { value: 'march', label: 'Mar' },
    { value: 'april', label: 'Apr' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'Jun' },
    { value: 'july', label: 'Jul' },
    { value: 'august', label: 'Aug' },
    { value: 'september', label: 'Sep' },
    { value: 'october', label: 'Oct' },
    { value: 'november', label: 'Nov' },
    { value: 'december', label: 'Dec' },
];

export default function Season({ data }: SeasonProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);
    const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
    const isTouchDevice = useRef(false);

    const {
        tag,
        title,
        description,
        seasonMonths,
        blueberryImage,
        hotspots,
        leavesImage,
    } = data;

    const blueberryImageData = blueberryImage?.node;
    const leavesImageData = leavesImage?.node;

    // Detect touch device on mount
    useEffect(() => {
        isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }, []);

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
                        const seasonTag = section.querySelector(".season__tag");
                        const seasonTitle = section.querySelector(".season__title");
                        const seasonDesc = section.querySelector(".season__description");
                        const seasonMonthElements = section.querySelectorAll(".season__month");
                        const seasonImage = section.querySelector(".season__blueberry-image");

                        if (seasonTag) fadeIn(seasonTag, { duration: 0.8, delay: 0.2, y: 20 });
                        if (seasonTitle) fadeIn(seasonTitle, { duration: 0.8, delay: 0.3, y: 20 });
                        if (seasonDesc) fadeIn(seasonDesc, { duration: 0.8, delay: 0.4, y: 20 });
                        if (seasonMonthElements.length) staggerFadeIn(seasonMonthElements, { duration: 0.6, stagger: 0.05, y: 20 });
                        if (seasonImage) fadeIn(seasonImage, { duration: 1, delay: 0.5, y: 30 });

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
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    const handleHotspotClick = (index: number) => {
        setActiveHotspot(activeHotspot === index ? null : index);
    };

    const handleMouseEnter = (index: number) => {
        // Only use hover on non-touch devices
        if (!isTouchDevice.current) {
            setActiveHotspot(index);
        }
    };

    const handleMouseLeave = () => {
        // Only use hover on non-touch devices
        if (!isTouchDevice.current) {
            setActiveHotspot(null);
        }
    };

    // Get position class for info window based on hotspot position
    const getInfoPositionClass = (positionX: number) => {
        if (positionX < 30) return 'season__hotspot-info--left';
        if (positionX > 70) return 'season__hotspot-info--right';
        return '';
    };

    return (
        <section className="season" ref={sectionRef}>
            <div className="container">
                <div className="season__grid">
                    {/* Left Column - Content */}
                    <div className="season__content">
                        {tag && (
                            <span className="season__tag" data-animate>
                                {tag}
                                <svg className="season__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </span>
                        )}

                        <h2 className="season__title" data-animate>{title}</h2>

                        {description && (
                            <p className="season__description" data-animate>{description}</p>
                        )}

                        {/* Months */}
                        <div className="season__months">
                            {MONTHS.map((month) => {
                                const isActive = seasonMonths?.includes(month.value);
                                return (
                                    <div
                                        key={month.value}
                                        className={`season__month ${isActive ? 'season__month--active' : ''}`}
                                        data-animate
                                    >
                                        <span className="season__month-label">{month.label}</span>
                                        {isActive && <span className="season__month-dot"></span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column - Blueberry with Hotspots */}
                    <div className="season__visual">
                        {blueberryImageData && (
                            <div className="season__blueberry-wrapper">
                                <Image
                                    src={blueberryImageData.sourceUrl}
                                    alt={blueberryImageData.altText || "Blueberry"}
                                    width={blueberryImageData.mediaDetails?.width || 600}
                                    height={blueberryImageData.mediaDetails?.height || 600}
                                    className="season__blueberry-image"
                                    data-animate
                                    loading="lazy"
                                />

                                {/* Hotspots */}
                                {hotspots && hotspots.map((hotspot: Hotspot, index: number) => (
                                    <div
                                        key={index}
                                        className={`season__hotspot ${activeHotspot === index ? 'season__hotspot--active' : ''}`}
                                        style={{
                                            left: `${hotspot.positionX}%`,
                                            top: `${hotspot.positionY}%`,
                                        }}
                                        onClick={() => handleHotspotClick(index)}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                    >

                                        <div className="season__hotspot-circle">
                                            <span className="season__hotspot-number">{index + 1}</span>
                                            <div className="season__hotspot-dot">
                                                <span className="season__hotspot-pulse"></span>
                                            </div>
                                        </div>

                                        {/* Info Window */}
                                        {activeHotspot === index && (
                                            <div className={`season__hotspot-info ${getInfoPositionClass(hotspot.positionX)}`}>
                                                <h4 className="season__hotspot-title">{hotspot.title}</h4>
                                                <p className="season__hotspot-description">{hotspot.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Leaves Decoration */}
            {leavesImageData && (
                <Image
                    src={leavesImageData.sourceUrl}
                    alt={leavesImageData.altText || "Leaves decoration"}
                    width={leavesImageData.mediaDetails?.width || 300}
                    height={leavesImageData.mediaDetails?.height || 300}
                    className="season__leaves"
                    loading="lazy"
                />
            )}
        </section>
    );
}
