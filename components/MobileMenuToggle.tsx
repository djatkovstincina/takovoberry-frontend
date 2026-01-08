'use client';

import { useEffect } from 'react';

export default function MobileMenuToggle() {
    useEffect(() => {
        const burgerToggle = document.getElementById('burgerToggle');
        const mobileMenu = document.querySelector('.header__menu');
        const siteHeader = document.querySelector('.site-header');
        const menuItems = document.querySelectorAll('.header__menu-item--has-children');

        if (!burgerToggle || !mobileMenu || !siteHeader) return;

        const toggleMenu = () => {
            burgerToggle.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
            siteHeader.classList.toggle('is-open');

            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('is-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        // Toggle main menu
        burgerToggle.addEventListener('click', toggleMenu);

        // Handle submenu toggles on mobile
        menuItems.forEach((menuItem) => {
            const toggleButton = menuItem.querySelector('.header__submenu-toggle');

            if (toggleButton) {
                toggleButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other open submenus (optional - for accordion behavior)
                    if (window.innerWidth < 992) {
                        menuItems.forEach((item) => {
                            if (item !== menuItem) {
                                item.classList.remove('submenu-open');
                            }
                        });
                    }

                    menuItem.classList.toggle('submenu-open');
                });
            }
        });

        // Close menu when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                mobileMenu.classList.contains('is-open') &&
                !mobileMenu.contains(target) &&
                !burgerToggle.contains(target)
            ) {
                toggleMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Close menu on escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu();
            }
        };

        document.addEventListener('keydown', handleEscape);

        // Cleanup
        return () => {
            burgerToggle.removeEventListener('click', toggleMenu);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, []);

    return null; // This component doesn't render anything
}
