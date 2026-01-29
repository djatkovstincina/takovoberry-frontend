// GraphQL queries for WordPress data with Polylang support

// Get all posts by language
export const GET_ALL_POSTS_BY_LANG = `
  query GetAllPosts($first: Int = 10, $language: LanguageCodeFilterEnum!) {
    posts(first: $first, where: { 
      orderby: { field: DATE, order: DESC },
      language: $language 
    }) {
      nodes {
        id
        title
        excerpt
        slug
        date
        readingTime
        language {
          code
          name
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// Get single post by slug and language
export const GET_POST_BY_SLUG_AND_LANG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      slug
      date
      modified
      readingTime
      seoMetaDescription
      language {
        code
        name
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      translations {
        slug
        language {
          code
        }
      }
    }
  }
`;

// Get all languages
export const GET_LANGUAGES = `
  query GetLanguages {
    languages {
      code
      name
      locale
      slug
    }
  }
`;

// Get menu by location with Polylang support
export const GET_MENU_BY_LOCATION = `
  query GetMenuByLocation($location: MenuLocationEnum!, $language: LanguageCodeFilterEnum) {
    menuItems(where: { location: $location, language: $language }, first: 50) {
      nodes {
        id
        label
        url
        path
        target
        cssClasses
        parentId
        order
        language {
          code
        }
      }
    }
  }
`;

// Original queries (keep for backward compatibility)

export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int = 10) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        excerpt
        slug
        date
        readingTime
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      slug
      date
      modified
      readingTime
      seoMetaDescription
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const GET_ALL_POSTS_SLUGS = `
  query GetAllPostsSlugs {
    posts(first: 1000) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_SITE_SETTINGS = `
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
      language
    }
  }
`;

export const GET_HEADER_SETTINGS = `
  query GetHeaderSettings {
    headerSettings {
      logo {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    generalSettings {
      title
    }
  }
`;

export const GET_FOOTER_SETTINGS = `
  query GetFooterSettings {
    footerSettings {
      copyright
      phone
      email
      facebookUrl
      instagramUrl
    }
  }
`;

export const GET_CATEGORIES = `
  query GetCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
        count
        description
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($slug: String!, $first: Int = 10) {
    category(id: $slug, idType: SLUG) {
      name
      description
      posts(first: $first) {
        nodes {
          id
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

// Get page with flexible content by slug and language
export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: String!, $language: LanguageCodeFilterEnum!) {
    pages(where: { name: $slug, language: $language }, first: 1) {
      nodes {
        id
        title
        slug
        seoMetaDescription
        language {
          code
          name
        }
        pageBuilder {
          pageBuilder {
            __typename
            fieldGroupName
            ... on PageBuilderPageBuilderHeroSectionLayout {
              tag
              title
              description
              video {
                node {
                  mediaItemUrl
                  mimeType
                  fileSize
                }
              }
              backgroundImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderPageHeroSectionLayout {
              tag
              title
              blueberriesImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderAboutContentSectionLayout {
              beforeImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              afterImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              leavesImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              contentBlocks {
                __typename
                fieldGroupName
                ... on PageBuilderPageBuilderContentBlocksHeadingLayout {
                  tag
                  title
                }
                ... on PageBuilderPageBuilderContentBlocksTextLayout {
                  text
                }
                ... on PageBuilderPageBuilderContentBlocksFeaturesLayout {
                  items {
                    text
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderServicesContentSectionLayout {
              sidebarTitle
              leavesImage {
                node {
                  sourceUrl
                  altText
                }
              }
              contentBlocks {
                __typename
                fieldGroupName
                ... on PageBuilderPageBuilderContentBlocksHeadingLayout {
                  tag
                  title
                }
                ... on PageBuilderPageBuilderContentBlocksTextLayout {
                  text
                }
                ... on PageBuilderPageBuilderContentBlocksFeaturesLayout {
                  items {
                    text
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderCoursesContentSectionLayout {
              rows {
                image {
                  node {
                    sourceUrl
                    altText
                  }
                }
                tag
                title
                description
              }
            }
            ... on PageBuilderPageBuilderGalleryContentSectionLayout {
              tag
              title
              description
              images(first: 100) {
                nodes {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderOurApproachSectionLayout {
              tag
              title
              description
              points {
                text
              }
              badgeText
              images {
                nodes {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              leavesImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderSeasonSectionLayout {
              tag
              title
              description
              seasonMonths
              blueberryImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              hotspots {
                title
                description
                positionX
                positionY
              }
              leavesImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderCardsSectionLayout {
              cards {
                image {
                  node {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                icon {
                  node {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                tag
                title
              }
            }
            ... on PageBuilderPageBuilderServicesSectionLayout {
              tag
              title
              services {
                image {
                  node {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                title
                description
              }
            }
            ... on PageBuilderPageBuilderCtaSectionLayout {
              backgroundImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              title
              description
              buttonText
              buttonLink
            }
            ... on PageBuilderPageBuilderAnnouncementsContentSectionLayout {
              tag
              title
              description
              pdfButtons {
                label
                file {
                  node {
                    mediaItemUrl
                    title
                  }
                }
              }
            }
            ... on PageBuilderPageBuilderContactContentSectionLayout {
              tag
              title
              description
              contactInfo {
                phone
                email
              }
              formId
              leavesImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;


