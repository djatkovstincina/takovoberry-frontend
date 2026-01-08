# Takovoberry Frontend - Next.js + WordPress

This is the frontend application for Takovoberry, built with Next.js 15 and powered by WordPress as a headless CMS using WPGraphQL.

## 🚀 Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **GraphQL**: Data fetching from WordPress via WPGraphQL
- **ISR (Incremental Static Regeneration)**: For optimal performance

## 📦 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── blog/              # Blog pages (coming soon)
├── lib/                    # Utilities
│   ├── graphql-client.ts  # GraphQL client configuration
│   └── queries.ts         # GraphQL queries
├── types/                  # TypeScript types
│   └── wordpress.ts       # WordPress data types
├── .env.local             # Environment variables (not in Git)
└── .env.example           # Example environment variables
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- WordPress backend running at `http://localhost:8888/takovoberry`
- WPGraphQL plugin installed and activated

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd /Applications/MAMP/htdocs/takovoberry/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables are already set up**
   - `.env.local` is configured to connect to your WordPress backend

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)
   - You should see your WordPress posts displayed!

## 🔧 Available Scripts

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Environment Variables

The `.env.local` file contains:

```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8888/takovoberry
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8888/takovoberry/graphql
NEXT_PUBLIC_SITE_NAME=Takovoberry
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📝 Features

- ✅ Server-Side Rendering (SSR)
- ✅ Incremental Static Regeneration (ISR) - Revalidates every 60 seconds
- ✅ Responsive design with Tailwind CSS
- ✅ Image optimization with Next.js Image component
- ✅ TypeScript for type safety
- ✅ GraphQL data fetching from WordPress
- ✅ SEO optimized

## 🔗 WordPress Integration

This app fetches data from WordPress using GraphQL:

- **Posts**: Latest blog posts with featured images, authors, and categories
- **Site Settings**: Site title, description, and other settings
- **Categories**: Post categories and taxonomies
- **Authors**: Author information and avatars

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [WPGraphQL Documentation](https://www.wpgraphql.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🚀 Deployment

This app can be deployed to:
- **Vercel** (Recommended): `vercel deploy`
- **Netlify**: Connect your Git repository
- **Any Node.js hosting**: Run `npm run build && npm run start`

## 🐛 Troubleshooting

### GraphQL Errors
- Make sure WordPress is running on MAMP
- Verify WPGraphQL plugin is activated
- Check that the GraphQL endpoint is accessible: `http://localhost:8888/takovoberry/graphql`

### No Posts Showing
- Create some posts in WordPress admin
- Make sure posts are published (not drafts)
- Check the browser console for errors

### CORS Issues
- The WordPress mu-plugin (`configure-wpgraphql.php`) handles CORS
- Make sure the mu-plugin is in `/wp-content/mu-plugins/`

## 📄 License

Open source licence

---

Built with ❤️ using Next.js and WordPress
