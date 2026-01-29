"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { GalleryContentSection } from "@/types/wordpress";
import { fadeIn, killAnimations } from "@/lib/animations";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Keyboard, EffectFade, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';

interface GalleryContentProps {
    data: GalleryContentSection;
}

export default function GalleryContent({ data }: GalleryContentProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const animationInitialized = useRef(false);
    const fullscreenRef = useRef<HTMLDivElement>(null);

    const { tag, title, description, images } = data;
    const galleryImages = images?.nodes || [];
    const totalImages = galleryImages.length;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        const textContent = section.querySelector(".gallery-content__info");
                        const gallery = section.querySelector(".gallery-content__gallery");
                        const thumbs = section.querySelector(".gallery-content__thumbnails-wrapper");

                        fadeIn(textContent, { delay: 0.1 });
                        fadeIn(gallery, { delay: 0.3 });
                        fadeIn(thumbs, { delay: 0.5 });

                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            if (section) {
                killAnimations(section);
            }
        };
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isFullscreen) return;

        if (e.key === 'Escape') {
            setIsFullscreen(false);
        }
    }, [isFullscreen]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    const openFullscreen = () => {
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    const handleSlideChange = (swiper: SwiperType) => {
        setCurrentIndex(swiper.activeIndex);
    };

    if (totalImages === 0) {
        return null;
    }

    return (
        <>
            <section ref={sectionRef} className="gallery-content">
                <div className="container">
                    <div className="gallery-content__container">
                        <div className="gallery-content__info" data-animate>
                            {tag && (
                                <div className="gallery-content__tag">
                                    {tag}
                                    <svg className="gallery-content__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                        <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                    </svg>
                                </div>
                            )}
                            <h2 className="gallery-content__title">{title}</h2>
                            {description && (
                                <p className="gallery-content__description">{description}</p>
                            )}
                        </div>

                        <div className="gallery-content__gallery" data-animate>
                            <div className="gallery-content__main">
                                <Swiper
                                    modules={[Thumbs, Keyboard, EffectFade]}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    keyboard={{ enabled: true }}
                                    effect="fade"
                                    fadeEffect={{ crossFade: true }}
                                    allowTouchMove={false}
                                    onSwiper={setMainSwiper}
                                    onSlideChange={handleSlideChange}
                                    className="gallery-content__main-swiper"
                                >
                                    {galleryImages.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="gallery-content__main-image">
                                                <Image
                                                    src={image.sourceUrl}
                                                    alt={image.altText || "Gallery image " + (index + 1)}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    loading="lazy"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="gallery-content__nav">
                                    <span className="gallery-content__counter">
                                        {currentIndex + 1}/{totalImages}
                                    </span>
                                    <div className="gallery-content__nav-buttons">
                                        <button
                                            className="gallery-content__nav-btn"
                                            onClick={openFullscreen}
                                            aria-label="Open fullscreen"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            className="gallery-content__nav-btn"
                                            onClick={() => mainSwiper?.slidePrev()}
                                            aria-label="Previous image"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            className="gallery-content__nav-btn"
                                            onClick={() => mainSwiper?.slideNext()}
                                            aria-label="Next image"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="gallery-content__thumbnails-wrapper" data-animate>
                    <Swiper
                        modules={[Thumbs, FreeMode]}
                        onSwiper={setThumbsSwiper}
                        slidesPerView={2.5}
                        spaceBetween={12}
                        watchSlidesProgress
                        freeMode={{
                            enabled: true,
                            sticky: false,
                            momentumBounce: false,
                        }}
                        grabCursor
                        touchRatio={1}
                        threshold={5}
                        breakpoints={{
                            640: {
                                slidesPerView: 3.5,
                                spaceBetween: 16,
                            },
                            1024: {
                                slidesPerView: 5.5,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 6.5,
                                spaceBetween: 20,
                            },
                        }}
                        className="gallery-content__thumbnails-swiper"
                    >
                        {galleryImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className={"gallery-content__thumbnail " + (index === currentIndex ? "gallery-content__thumbnail--active" : "")}
                                    onClick={() => mainSwiper?.slideTo(index)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={"Go to image " + (index + 1)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            mainSwiper?.slideTo(index);
                                        }
                                    }}
                                >
                                    <Image
                                        src={image.sourceUrl}
                                        alt={image.altText || "Thumbnail " + (index + 1)}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        draggable={false}
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {isFullscreen && (
                <div ref={fullscreenRef} className="gallery-lightbox">
                    <div className="gallery-lightbox__overlay" onClick={closeFullscreen} />

                    <div className="gallery-lightbox__content">
                        <Swiper
                            modules={[Keyboard]}
                            keyboard={{ enabled: true }}
                            initialSlide={currentIndex}
                            onSlideChange={(swiper) => {
                                setCurrentIndex(swiper.activeIndex);
                                mainSwiper?.slideTo(swiper.activeIndex);
                            }}
                            className="gallery-lightbox__swiper"
                        >
                            {galleryImages.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <div className="gallery-lightbox__image">
                                        <Image
                                            src={image.sourceUrl}
                                            alt={image.altText || "Gallery image " + (index + 1)}
                                            fill
                                            style={{ objectFit: "contain" }}
                                            priority={index === currentIndex}
                                            loading="lazy"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="gallery-lightbox__controls">
                            <span className="gallery-lightbox__counter">
                                {currentIndex + 1}/{totalImages}
                            </span>
                            <button
                                className="gallery-lightbox__close"
                                onClick={closeFullscreen}
                                aria-label="Close fullscreen"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
