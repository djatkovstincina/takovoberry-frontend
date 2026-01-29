"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CTASection as CTASectionType } from "@/types/wordpress";
import { staggerFadeIn, killAnimations } from "@/lib/animations";

interface CTAProps {
    data: CTASectionType;
}

const CTA: React.FC<CTAProps> = ({ data }) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Animate title, description, and button
                        const title = section.querySelector(".cta__title");
                        const description = section.querySelector(".cta__description");
                        const button = section.querySelector(".cta__button");

                        const elements = [title, description, button].filter(Boolean);

                        if (elements.length > 0) {
                            setTimeout(() => {
                                staggerFadeIn(elements, { stagger: 0.2 });
                            }, 100);
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
        <section
            ref={sectionRef}
            className={`cta ${data.backgroundImage ? "cta--with-bg" : "cta--no-bg"}`}
        >
            {data.backgroundImage && (
                <div className="cta__background">
                    <Image
                        src={data.backgroundImage.node.sourceUrl}
                        alt={data.backgroundImage.node.altText || ""}
                        fill
                        className="cta__background-image"
                        sizes="100vw"
                        priority={false}
                        loading="lazy"
                    />
                </div>
            )}

            <div className="container">
                <div className="cta__content">
                    <h2 className="cta__title" data-animate>{data.title}</h2>
                    {data.description && (
                        <p className="cta__description" data-animate>{data.description}</p>
                    )}
                    <Link href={data.buttonLink} className="cta__button" data-animate>
                        {data.buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
