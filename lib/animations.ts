/**
 * GSAP Animation Utilities
 * Reusable animation functions using GSAP
 */

import { gsap } from "gsap";

/**
 * Floating animation - creates a gentle up/down and side-to-side movement
 * @param element - The DOM element or selector to animate
 * @param options - Animation options
 */
export const floatingAnimation = (
  element: gsap.DOMTarget,
  options?: {
    yDistance?: number;
    xDistance?: number;
    duration?: number;
  }
) => {
  const {
    yDistance = -20,
    xDistance = 10,
    duration = 3,
  } = options || {};

  // Movement animation
  gsap.to(element, {
    y: yDistance,
    x: xDistance,
    duration: duration,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });
};

/**
 * Circular/Triangular floating animation - moves in a circular or triangular path
 * @param element - The DOM element or selector to animate
 * @param options - Animation options
 */
export const circularFloating = (
  element: gsap.DOMTarget,
  options?: {
    radius?: number;
    duration?: number;
    shape?: "circle" | "triangle";
    rotation?: boolean;
  }
) => {
  const {
    radius = 30,
    duration = 8,
    shape = "circle",
    rotation = true,
  } = options || {};

  const timeline = gsap.timeline({ repeat: -1 });

  if (shape === "circle") {
    // Circular motion using bezier path
    timeline.to(element, {
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: radius, y: -radius },
          { x: radius * 2, y: 0 },
          { x: radius, y: radius },
          { x: 0, y: 0 },
        ],
        curviness: 1.5,
      },
      duration: duration,
      ease: "none",
    });
  } else {
    // Triangle motion - sharp corners
    timeline
      .to(element, {
        x: radius * 1.5,
        y: -radius,
        duration: duration / 3,
        ease: "ease1.inOut",
      })
      .to(element, {
        x: radius * 1.5,
        y: radius,
        duration: duration / 3,
        ease: "ease1.inOut",
      })
      .to(element, {
        x: 0,
        y: 0,
        duration: duration / 3,
        ease: "ease1.inOut",
      });
  }

  // Optional rotation
  if (rotation) {
    gsap.to(element, {
      rotation: 360,
      duration: duration * 2,
      ease: "none",
      repeat: -1,
    });
  }

  return timeline;
};

/**
 * Fade in animation
 * @param element - The DOM element or selector to animate
 * @param options - Animation options
 */
export const fadeIn = (
  element: gsap.DOMTarget,
  options?: {
    duration?: number;
    delay?: number;
    ease?: string;
    y?: number;
  }
) => {
  const { duration = 1, delay = 0, ease = "power2.out", y = 20 } = options || {};

  // Set initial state immediately to prevent flash
  gsap.set(element, { opacity: 0, y: y });

  // Then animate in
  gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: duration,
    delay: delay,
    ease: ease,
  });
};

/**
 * Slide down from top animation (for headers)
 * @param element - The DOM element or selector to animate
 * @param options - Animation options
 */
export const slideDownFromTop = (
  element: gsap.DOMTarget,
  options?: {
    duration?: number;
    delay?: number;
    ease?: string;
    distance?: number;
  }
) => {
  const { duration = 0.8, delay = 0, ease = "power3.out", distance = -100 } = options || {};

  // Set initial state immediately to prevent flash
  gsap.set(element, { y: distance, opacity: 0 });

  // Then animate in
  gsap.to(element, {
    y: 0,
    opacity: 1,
    duration: duration,
    delay: delay,
    ease: ease,
  });
};

/**
 * Stagger fade in animation for multiple elements
 * @param elements - The DOM elements or selector to animate
 * @param options - Animation options
 */
export const staggerFadeIn = (
  elements: gsap.DOMTarget,
  options?: {
    duration?: number;
    stagger?: number;
    ease?: string;
    y?: number;
  }
) => {
  const { duration = 0.8, stagger = 0.2, ease = "power2.out", y = 30 } = options || {};

  // Set initial state immediately to prevent flash
  gsap.set(elements, { opacity: 0, y: y });

  // Then animate in with stagger
  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: duration,
    stagger: stagger,
    ease: ease,
  });
};

/**
 * Scale on hover
 * @param element - The DOM element to animate
 * @param scale - Scale value (default: 1.1)
 */
export const scaleOnHover = (element: HTMLElement, scale: number = 1.1) => {
  element.addEventListener("mouseenter", () => {
    gsap.to(element, { scale: scale, duration: 0.3, ease: "power2.out" });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
};

/**
 * Parallax effect
 * @param element - The DOM element to animate
 * @param speed - Parallax speed (0-1, lower is slower)
 */
export const parallaxScroll = (element: gsap.DOMTarget, speed: number = 0.5) => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    gsap.to(element, {
      y: scrollY * speed,
      ease: "none",
      duration: 0,
    });
  };

  window.addEventListener("scroll", handleScroll);
  
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

/**
 * Falling elements animation - creates random falling items
 * @param container - The container element where items will fall
 * @param options - Animation options
 */
export const fallingElements = (
  container: HTMLElement,
  options: {
    imageSrc?: string;
    imageSources?: string[];
    imageSize?: number;
    count?: number;
    duration?: { min: number; max: number };
    delay?: { min: number; max: number };
    leftSide?: boolean;
    rightSide?: boolean;
    startOffsetTop?: number; // Offset from top in pixels where falling starts
  }
) => {
  const {
    imageSrc,
    imageSources,
    imageSize = 40,
    count = 10,
    duration = { min: 3, max: 6 },
    delay = { min: 0, max: 3 },
    leftSide = true,
    rightSide = true,
    startOffsetTop = 0,
  } = options;

  // Use imageSources if provided, otherwise fall back to single imageSrc
  const sources = imageSources || (imageSrc ? [imageSrc] : []);
  
  if (sources.length === 0) {
    console.warn('No image sources provided for falling elements');
    return () => {};
  }

  const items: HTMLElement[] = [];

  // Create falling items
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "falling-element";
    item.style.cssText = `
      position: absolute;
      width: ${imageSize}px;
      height: ${imageSize}px;
      pointer-events: none;
      z-index: 0;
    `;

    const img = document.createElement("img");
    // Pick a random image from the sources array
    const randomImageSrc = sources[Math.floor(Math.random() * sources.length)];
    img.src = randomImageSrc;
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;
    item.appendChild(img);

    // Position on left or right side
    const isLeft = leftSide && (!rightSide || Math.random() > 0.5);
    const horizontalPosition = isLeft 
      ? Math.random() * 15 // 0-15% from left
      : 85 + Math.random() * 15; // 85-100% from left (right side)
    
    item.style.left = `${horizontalPosition}%`;
    item.style.top = `${startOffsetTop - imageSize}px`;

    container.appendChild(item);
    items.push(item);

    // Animate falling
    const fallDuration = duration.min + Math.random() * (duration.max - duration.min);
    const fallDelay = delay.min + Math.random() * (delay.max - delay.min);
    const rotation = Math.random() * 360;
    const swing = (Math.random() - 0.5) * 50; // Slight horizontal swing

    gsap.to(item, {
      y: `+=${container.offsetHeight - startOffsetTop + imageSize * 2}`,
      x: swing,
      rotation: rotation,
      duration: fallDuration,
      delay: fallDelay,
      ease: "none",
      repeat: -1,
      repeatDelay: delay.min + Math.random() * (delay.max - delay.min),
      onRepeat: () => {
        // Randomize position on repeat
        const newIsLeft = leftSide && (!rightSide || Math.random() > 0.5);
        const newHorizontalPosition = newIsLeft
          ? Math.random() * 15
          : 85 + Math.random() * 15;
        item.style.left = `${newHorizontalPosition}%`;
      }
    });
  }

  // Return cleanup function
  return () => {
    items.forEach(item => {
      gsap.killTweensOf(item);
      if (item.parentNode) {
        item.parentNode.removeChild(item);
      }
    });
  };
};

/**
 * Levitating elements animation - creates floating items on sides
 * @param container - The container element where items will levitate
 * @param options - Animation options
 */
export const levitatingElements = (
  container: HTMLElement,
  options: {
    imageSrc?: string;
    imageSources?: string[];
    imageSize?: number;
    count?: number;
    leftSide?: boolean;
    rightSide?: boolean;
  }
) => {
  const {
    imageSrc,
    imageSources,
    imageSize = 40,
    count = 8,
    leftSide = true,
    rightSide = true,
  } = options;

  // Use imageSources if provided, otherwise fall back to single imageSrc
  const sources = imageSources || (imageSrc ? [imageSrc] : []);
  
  if (sources.length === 0) {
    console.warn('No image sources provided for levitating elements');
    return () => {};
  }

  const items: HTMLElement[] = [];

  // Create levitating items
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "levitating-element";
    item.style.cssText = `
      position: absolute;
      width: ${imageSize}px;
      height: ${imageSize}px;
      pointer-events: none;
      z-index: 1;
    `;

    const img = document.createElement("img");
    // Pick a random image from the sources array
    const randomImageSrc = sources[Math.floor(Math.random() * sources.length)];
    img.src = randomImageSrc;
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;
    item.appendChild(img);

    // Position on left or right side
    const isLeft = leftSide && (!rightSide || Math.random() > 0.5);
    const horizontalPosition = isLeft 
      ? Math.random() * 8 // 0-8% from left
      : 92 + Math.random() * 8; // 92-100% from left (right side)
    
    // Random vertical position
    const verticalPosition = Math.random() * 80 + 10; // 10-90% from top
    
    item.style.left = `${horizontalPosition}%`;
    item.style.top = `${verticalPosition}%`;

    container.appendChild(item);
    items.push(item);

    // Create levitating animation with random parameters
    const floatDuration = 3 + Math.random() * 3; // 3-6 seconds
    const floatDistance = 15 + Math.random() * 20; // 15-35px
    const rotationAmount = (Math.random() - 0.5) * 30; // -15 to 15 degrees
    const startDelay = Math.random() * 1; // 0-1 second

    // Fade in first
    gsap.to(item, {
      duration: 1,
      delay: startDelay,
      ease: "power2.out",
    });

    // Levitate animation (up and down)
    gsap.to(item, {
      y: -floatDistance,
      duration: floatDuration,
      delay: startDelay,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Slight horizontal drift
    gsap.to(item, {
      x: (Math.random() - 0.5) * 10, // -5 to 5px
      duration: floatDuration * 0.7,
      delay: startDelay,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Subtle rotation
    gsap.to(item, {
      rotation: rotationAmount,
      duration: floatDuration * 1.5,
      delay: startDelay,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  // Return cleanup function
  return () => {
    items.forEach(item => {
      gsap.killTweensOf(item);
      if (item.parentNode) {
        item.parentNode.removeChild(item);
      }
    });
  };
};

/**
 * Clean up all GSAP animations for an element
 * @param element - The DOM element or selector
 */
export const killAnimations = (element: gsap.DOMTarget) => {
  gsap.killTweensOf(element);
};


