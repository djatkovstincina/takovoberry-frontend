"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { ServicesSection as ServicesSectionType } from "@/types/wordpress";
import { staggerFadeIn, killAnimations } from "@/lib/animations";

interface ServicesProps {
    data: ServicesSectionType;
}

const Services: React.FC<ServicesProps> = ({ data }) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Animate tag and title
                        const tag = section.querySelector(".services__tag");
                        const title = section.querySelector(".services__title");

                        if (tag && title) {
                            setTimeout(() => {
                                staggerFadeIn([tag, title], { stagger: 0.2 });
                            }, 100);
                        }

                        // Animate cards with stagger
                        const cards = section.querySelectorAll(".swiper-slide");
                        if (cards.length > 0) {
                            setTimeout(() => {
                                staggerFadeIn(Array.from(cards).slice(0, 5), {
                                    stagger: 0.15,
                                });
                            }, 400);
                        }

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

    return (
        <section ref={sectionRef} className="services">
            <div className="container">
                <div className="services__header">
                    {data.tag && (
                        <p className="services__tag" data-animate>
                            {data.tag}
                            <svg className="services__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                            </svg>
                        </p>
                    )}
                    <h2 className="services__title" data-animate>{data.title}</h2>
                </div>
            </div>

            <div className="services__carousel">
                <Swiper
                    modules={[FreeMode, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1.5}
                    freeMode={{
                        enabled: true,
                        sticky: false,
                        momentumRatio: 0.5,
                        momentumVelocityRatio: 0.5,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    grabCursor={true}
                    className="services__swiper"
                    breakpoints={{
                        320: {
                            spaceBetween: 16,
                            slidesPerView: 1.5
                        },
                        768: {
                            spaceBetween: 20,
                            slidesPerView: 2.5
                        },
                        1024: {
                            spaceBetween: 24,
                            slidesPerView: 3.5
                        },
                    }}
                >
                    {data.services.map((service, index) => (
                        <SwiperSlide key={index} className="services__slide" data-animate>
                            <div className="services__card">
                                <div className="services__card-image-wrapper">
                                    <Image
                                        src={service.image.node.sourceUrl}
                                        alt={service.image.node.altText || service.title}
                                        fill
                                        className="services__card-image"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="services__card-content">
                                    <h3 className="services__card-title">{service.title}</h3>
                                    <p className="services__card-description">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Services;
