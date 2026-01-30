"use client";

import { useEffect, useRef } from "react";
import type { AnnouncementsContentSection } from "@/types/wordpress";
import { fadeIn, staggerFadeIn, killAnimations } from "@/lib/animations";

interface AnnouncementsContentProps {
    data: AnnouncementsContentSection;
}

export default function AnnouncementsContent({ data }: AnnouncementsContentProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);

    const { tag, title, description, pdfButtons } = data;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        // Function to trigger animations
        const triggerAnimations = () => {
            if (animationInitialized.current) return;
            animationInitialized.current = true;

            const header = section.querySelector(".announcements-content__header");
            const buttons = section.querySelectorAll(".announcements-content__button");

            fadeIn(header, { delay: 0.1 });
            staggerFadeIn(buttons, { stagger: 0.1 });
        };

        // Check if section is already in viewport (for mobile or fast page loads)
        const rect = section.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
            // Small delay to ensure DOM is ready
            requestAnimationFrame(() => {
                triggerAnimations();
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        triggerAnimations();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1, rootMargin: "50px" }
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
        <section ref={sectionRef} className="announcements-content">
            <div className="container">
                <div className="announcements-content__header" data-animate>
                    {tag && (
                        <div className="announcements-content__tag">
                            {tag}
                            <svg className="announcements-content__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                            </svg>
                        </div>
                    )}
                    <h2 className="announcements-content__title">{title}</h2>
                    {description && (
                        <div
                            className="announcements-content__description prose"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                </div>

                {pdfButtons && pdfButtons.length > 0 && (
                    <div className="announcements-content__buttons">
                        {pdfButtons.map((button, index) => (
                            <a
                                key={index}
                                href={button.file?.node?.mediaItemUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="announcements-content__button"
                                data-animate
                                download
                            >
                                <svg className="announcements-content__button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.83334 8.33331L10 12.5L14.1667 8.33331" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="announcements-content__button-label">{button.label}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
