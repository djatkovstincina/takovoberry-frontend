// TypeScript types for WordPress GraphQL data

export interface PostTranslation {
  slug: string;
  language: {
    code: string;
  };
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  slug: string;
  date: string;
  modified?: string;
  readingTime?: number;
  seoMetaDescription?: string;
  language?: {
    code: string;
    name: string;
  };
  translations?: PostTranslation[];
  author: {
    node: {
      name: string;
      description?: string;
      avatar: {
        url: string;
      };
    };
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  categories?: {
    nodes: Category[];
  };
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  url: string;
  language: string;
}

export interface PostsResponse {
  posts: {
    nodes: Post[];
  };
}

export interface PostResponse {
  post: Post;
}

export interface CategoriesResponse {
  categories: {
    nodes: Category[];
  };
}

export interface SiteSettingsResponse {
  generalSettings: SiteSettings;
}

export interface CategoryPostsResponse {
  category: {
    name: string;
    description: string;
    posts: {
      nodes: Post[];
    };
  };
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  target?: string;
  cssClasses?: string[];
  parentId?: string | null;
  order: number;
  language?: {
    code: string;
  };
  children?: MenuItem[];
}

export interface MenuResponse {
  menuItems: {
    nodes: MenuItem[];
  };
}

export interface HeaderSettings {
  logo?: {
    sourceUrl: string;
    altText: string;
    mediaDetails?: {
      width: number;
      height: number;
    };
  };
}

export interface HeaderSettingsResponse {
  headerSettings: HeaderSettings;
  generalSettings: {
    title: string;
  };
}

export interface FooterSettings {
  copyright: string;
  phone?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface FooterSettingsResponse {
  footerSettings: FooterSettings;
}

// Flexible Content - Page Builder Types
export interface HeroSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  description?: string;
  video?: {
    node: {
      mediaItemUrl: string;
      mimeType: string;
      fileSize: number;
    };
  };
  backgroundImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

export interface PageHeroSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  blueberriesImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

export interface AboutContentSection {
  fieldGroupName: string;
  beforeImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  afterImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  leavesImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  contentBlocks?: Array<ContentBlock>;
}

export interface ContentBlock {
  fieldGroupName: string;
  __typename?: string;
}

export interface HeadingBlock extends ContentBlock {
  tag?: string;
  title: string;
}

export interface TextBlock extends ContentBlock {
  text: string;
}

export interface FeaturesBlock extends ContentBlock {
  items: Array<{
    text: string;
  }>;
}

export interface ServicesContentSection {
  fieldGroupName: string;
  sidebarTitle?: string;
  leavesImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  contentBlocks?: Array<ContentBlock>;
}

export interface CourseRow {
  image: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  tag?: string;
  title: string;
  description: string;
}

export interface CoursesContentSection {
  fieldGroupName: string;
  rows: CourseRow[];
}

export interface GalleryImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface GalleryContentSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  description?: string;
  images: {
    nodes: GalleryImage[];
  };
}

export interface OurApproachSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  description?: string;
  points?: Array<{
    text: string;
  }>;
  badgeText?: string;
  images?: {
    nodes: Array<{
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    }>;
  };
  leavesImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

export interface SeasonSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  description?: string;
  seasonMonths?: string[];
  blueberryImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  hotspots?: Array<{
    title: string;
    description: string;
    positionX: number;
    positionY: number;
  }>;
  leavesImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

export interface CardsSection {
  fieldGroupName: string;
  cards: Array<{
    image: {
      node: {
        sourceUrl: string;
        altText: string;
        mediaDetails?: {
          width: number;
          height: number;
        };
      };
    };
    icon: {
      node: {
        sourceUrl: string;
        altText: string;
        mediaDetails?: {
          width: number;
          height: number;
        };
      };
    };
    tag: string;
    title: string;
  }>;
}

export interface ServicesSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  services: Array<{
    image: {
      node: {
        sourceUrl: string;
        altText: string;
        mediaDetails?: {
          width: number;
          height: number;
        };
      };
    };
    title: string;
    description: string;
  }>;
}

export interface CTASection {
  fieldGroupName: string;
  backgroundImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
}

export interface PdfButton {
  label: string;
  file: {
    node: {
      mediaItemUrl: string;
      title: string;
    };
  };
}

export interface AnnouncementsContentSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  description?: string;
  pdfButtons?: PdfButton[];
}

export interface ContactInfo {
  phone?: string;
  email?: string;
}

export interface ContactContentSection {
  fieldGroupName: string;
  tag?: string;
  title: string;
  description?: string;
  contactInfo?: ContactInfo;
  formId?: string;
  leavesImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

export interface PageBuilderSection {
  fieldGroupName: string;
  [key: string]: unknown;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  language: {
    code: string;
    name: string;
  };
  pageBuilder?: {
    pageBuilder: PageBuilderSection[];
  };
}

export interface PageResponse {
  pages: {
    nodes: PageData[];
  };
}


