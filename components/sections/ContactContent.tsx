"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import type { ContactContentSection } from "@/types/wordpress";
import type { Locale } from "@/i18n-config";
import { fadeIn, staggerFadeIn, killAnimations } from "@/lib/animations";
import ContactForm from "@/components/ContactForm";
import { getUITranslations } from "@/lib/translations";

interface ContactContentProps {
    data: ContactContentSection;
}

// SVG Icons for contact info
const PhoneIcon = () => (
    <svg className="contact-content__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const EmailIcon = () => (
    <svg className="contact-content__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const ContactContent: React.FC<ContactContentProps> = ({ data }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const animationInitialized = useRef(false);
    const params = useParams();
    const lang = (params?.lang as Locale) || "en";
    const t = getUITranslations(lang);

    const { tag, title, description, contactInfo, formId, leavesImage } = data;
    const leavesImageData = leavesImage?.node;

    // Check if we have any contact info to display (only phone and email now)
    const hasContactInfo = contactInfo && (
        contactInfo.phone ||
        contactInfo.email
    );

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animationInitialized.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationInitialized.current) {
                        animationInitialized.current = true;

                        // Animate header elements
                        const tagEl = section.querySelector(".contact-content__tag");
                        const titleEl = section.querySelector(".contact-content__title");
                        const descriptionEl = section.querySelector(".contact-content__description");

                        const headerElements = [tagEl, titleEl, descriptionEl].filter(Boolean);
                        if (headerElements.length > 0) {
                            staggerFadeIn(headerElements, { stagger: 0.15 });
                        }

                        // Animate contact info items
                        const infoItems = section.querySelectorAll(".contact-content__info-item");
                        if (infoItems.length > 0) {
                            setTimeout(() => {
                                staggerFadeIn(Array.from(infoItems), { stagger: 0.1 });
                            }, 300);
                        }

                        // Animate form container
                        const formContainer = section.querySelector(".contact-content__form");
                        if (formContainer) {
                            fadeIn(formContainer, { delay: 0.4 });
                        }

                        // Animate map container
                        const mapContainer = section.querySelector(".contact-content__map");
                        if (mapContainer) {
                            fadeIn(mapContainer, { delay: 0.5 });
                        }

                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.15 }
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
        <section ref={sectionRef} className="contact-content">
            {/* Decorative leaves image */}
            {leavesImageData && (
                <div className="contact-content__leaves">
                    <Image
                        src={leavesImageData.sourceUrl}
                        alt={leavesImageData.altText || "Decorative leaves"}
                        fill
                        style={{ objectFit: "contain", objectPosition: "right top" }}
                    />
                </div>
            )}

            <div className="container">
                <div className="contact-content__container">
                    {/* Header Section */}
                    <div className="contact-content__header">
                        {tag && (
                            <span className="contact-content__tag" data-animate>
                                {tag}
                                <svg className="contact-content__tag-icon" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.307 0.00357151C13.6957 -0.0589631 11.0706 0.931503 9.08276 2.98706C7.08904 5.04061 6.13323 7.75177 6.19187 10.4428C8.79934 10.5053 11.4283 9.51887 13.4161 7.46129C15.4079 5.40573 16.3657 2.69658 16.307 0.00357151Z" fill="#B5CE61" />
                                    <path d="M0.00158783 0.00155211C-0.0355503 1.64762 0.548881 3.3078 1.76661 4.5605C2.98434 5.81724 4.58908 6.42241 6.18601 6.38409C6.22315 4.73802 5.63676 3.08187 4.41903 1.82513C3.20326 0.568396 1.5946 -0.0347579 0.00158783 0.00155211Z" fill="#B5CE61" />
                                </svg>
                            </span>
                        )}
                        {title && (
                            <h1 className="contact-content__title" data-animate>
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="contact-content__description" data-animate>
                                {description}
                            </p>
                        )}
                        {/* Contact Info Section */}
                        {hasContactInfo && (
                            <div className="contact-content__info">
                                {/* Phone */}
                                {contactInfo?.phone && (
                                    <a
                                        href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                                        className="contact-content__info-item contact-content__info-item--link"
                                        data-animate
                                    >
                                        <div className="contact-content__icon">
                                            <PhoneIcon />
                                        </div>
                                        <div className="contact-content__info-text">
                                            <span className="contact-content__info-label">{t.contact.phone}</span>
                                            <span className="contact-content__info-value">{contactInfo.phone}</span>
                                        </div>
                                    </a>
                                )}

                                {/* Email */}
                                {contactInfo?.email && (
                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="contact-content__info-item contact-content__info-item--link"
                                        data-animate
                                    >
                                        <div className="contact-content__icon">
                                            <EmailIcon />
                                        </div>
                                        <div className="contact-content__info-text">
                                            <span className="contact-content__info-label">{t.contact.email}</span>
                                            <span className="contact-content__info-value">{contactInfo.email}</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="contact-content__grid">

                        {/* Contact Form Section */}
                        {formId && (
                            <div className="contact-content__form" data-animate>
                                <ContactForm formId={formId} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactContent;