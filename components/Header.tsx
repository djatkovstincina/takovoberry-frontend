import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/i18n-config";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenuToggle from "./MobileMenuToggle";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MENU_BY_LOCATION, GET_HEADER_SETTINGS } from "@/lib/queries-polylang";
import { MenuResponse, HeaderSettingsResponse, MenuItem } from "@/types/wordpress";

interface HeaderProps {
  lang: Locale;
}

// Build hierarchical menu structure from flat array
function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();
  const rootItems: MenuItem[] = [];

  // First pass: create a map of all items with children arrays
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: build the tree structure
  items.forEach(item => {
    const menuItem = itemMap.get(item.id)!;

    if (!item.parentId || item.parentId === null || item.parentId === "null") {
      // This is a root item
      rootItems.push(menuItem);
    } else {
      // This is a child item, add it to its parent's children
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(menuItem);
      } else {
        // Parent not found, treat as root item
        rootItems.push(menuItem);
      }
    }
  });

  // Sort items by order at each level
  const sortByOrder = (items: MenuItem[]) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(rootItems);
  return rootItems;
}

async function getHeaderData(lang: Locale) {
  try {
    // Fetch header settings first
    const headerData = await graphqlClient.request<HeaderSettingsResponse>(GET_HEADER_SETTINGS);

    // Try to fetch menu, but don't fail if it doesn't exist
    let menuItems: MenuItem[] = [];
    try {
      const menuData = await graphqlClient.request<MenuResponse>(GET_MENU_BY_LOCATION, {
        location: "PRIMARY",
        language: lang.toUpperCase(), // Pass the current language in uppercase (EN, SR)
      });

      if (menuData.menuItems?.nodes) {
        // Build hierarchical menu structure
        menuItems = buildMenuTree(menuData.menuItems.nodes);
      }
    } catch (menuError) {
      console.warn("Menu not found or error fetching menu:", menuError);
      // Continue with empty menu items
    }

    return {
      menuItems,
      headerSettings: headerData.headerSettings,
      siteTitle: headerData.generalSettings.title,
    };
  } catch (error) {
    console.error("Error fetching header data:", error);
    return {
      menuItems: [],
      headerSettings: null,
      siteTitle: "Takovoberry",
    };
  }
}

// Recursive menu item component
function MenuItemComponent({ item }: { item: MenuItem }) {
  const hasChildren = item.children && item.children.length > 0;

  // Extract clean path from WordPress URL
  const getCleanPath = (path: string, url: string): string => {
    // Try to extract the page slug from the path
    const pathParts = path.split('/').filter(Boolean);
    const wpBasePath = 'takovoberry'; // WordPress installation folder

    // If path has multiple parts, remove the WordPress installation folder
    if (pathParts.length > 0 && pathParts[0].toLowerCase() === wpBasePath.toLowerCase()) {
      const cleanedParts = pathParts.slice(1);
      // If nothing left after removing wp folder, it's the home page
      if (cleanedParts.length === 0) {
        return '/';
      }
      return '/' + cleanedParts.join('/');
    }

    // If it's an external URL, return as-is
    if (url.startsWith('http') && !url.includes('localhost')) {
      return url;
    }

    return path;
  };

  const cleanPath = getCleanPath(item.path || '', item.url);

  return (
    <li className={`header__menu-item ${hasChildren ? 'header__menu-item--has-children' : ''}`}>
      <div className="header__menu-item-wrapper">
        <Link
          href={cleanPath}
          target={item.target || "_self"}
          className="header__menu-link"
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button className="header__submenu-toggle" aria-label="Toggle submenu">
            <svg className="header__submenu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </div>
      {hasChildren && (
        <ul className="header__submenu">
          {item.children!.map((child) => (
            <MenuItemComponent key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function Header({ lang }: HeaderProps) {
  const { menuItems, headerSettings, siteTitle } = await getHeaderData(lang);

  return (
    <header className="site-header">
      <div className="container header" data-animate>
        <Link href={`/${lang}`} className="header__logo-link">
          {headerSettings?.logo?.sourceUrl ? (
            <Image
              src={headerSettings.logo.sourceUrl}
              alt={siteTitle}
              width={167}
              height={50}
              priority
              unoptimized
            />
          ) : (
            <div className="">
              Takovo Berry
            </div>
          )}
        </Link>

        {/* Navigation Menu - Center */}
        <nav className="header__menu">
          <ul className="header__menu-list">
            {menuItems.map((item) => (
              <MenuItemComponent key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        {/* Language Switcher - Right */}
        <div className="header__right">
          <LanguageSwitcher currentLang={lang} />

          {/* Mobile Menu Button */}
          <button id="burgerToggle" className="header__burger" aria-label="Toggle Menu">
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Toggle Script */}
      <MobileMenuToggle />
    </header>
  );
}
