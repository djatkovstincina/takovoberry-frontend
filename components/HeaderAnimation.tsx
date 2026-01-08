"use client";

import { useEffect, useRef } from "react";
import { slideDownFromTop } from "@/lib/animations";

export default function HeaderAnimation() {
    const animationInitialized = useRef(false);

    useEffect(() => {
        if (animationInitialized.current) return;
        animationInitialized.current = true;

        const header = document.querySelector(".header");

        if (!header) return;

        // Apply slide down animation
        slideDownFromTop(header, {
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            distance: -100,
        });
    }, []);

    return null; // This component doesn't render anything
}
