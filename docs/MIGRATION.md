# Takovoberry Migration Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────┐     ┌────────────────────────┐  │
│  │   Vercel (Free)    │     │  Hostinger Business    │  │
│  │                    │     │                        │  │
│  │  Next.js 15        │────▶│  WordPress + Plugins   │  │
│  │  Frontend App      │     │  (Headless CMS)        │  │
│  │                    │◀────│                        │  │
│  │  takovoberry.      │     │  cms-takovoberry.      │  │
│  │  orbu.studio       │     │  orbu.studio           │  │
│  └────────────────────┘     └────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Part 1: WordPress Migration (Hostinger)

### Step 1: Create WordPress Subdomain on Hostinger

1. Log in to **hPanel** (Hostinger control panel)
2. Go to **Websites** → **orbu.studio**
3. Go to **Domains** → **Subdomains**
4. Create subdomain: `cms-takovoberry.orbu.studio`
5. Wait for DNS propagation (can take a few minutes)

### Step 2: Install WordPress

1. In hPanel, go to **Websites** → **Add Website**
2. Select **WordPress**
3. Choose domain: `cms-takovoberry.orbu.studio`
4. Set admin credentials (save these!)
5. Complete installation

### Step 3: Install Required Plugins

Install these plugins in WordPress admin:

| Plugin | Source | Notes |
|--------|--------|-------|
| **Advanced Custom Fields PRO** | License/Upload | Required for flexible content |
| **WPGraphQL** | WordPress.org | GraphQL API |
| **WPGraphQL for ACF** | GitHub/Upload | ACF fields in GraphQL |
| **Polylang** | WordPress.org | Multilingual |
| **WPGraphQL Polylang** | GitHub/Upload | Polylang in GraphQL |
| **Contact Form 7** | WordPress.org | Contact forms |

**Plugin Download Links:**
- WPGraphQL: https://wordpress.org/plugins/wpgraphql/
- WPGraphQL for ACF: https://github.com/wp-graphql/wpgraphql-acf
- WPGraphQL Polylang: https://github.com/valu-digital/wp-graphql-polylang

### Step 4: Activate Headless Theme

1. Upload the `takovoberry-headless` theme folder to:
   `/wp-content/themes/takovoberry-headless/`
2. In WordPress admin: **Appearance** → **Themes**
3. Activate **Takovoberry Headless**
4. Go to **Settings** → **Headless Settings**
5. Set Frontend URL: `https://takovoberry.orbu.studio`

### Step 5: Import ACF Field Groups

1. In local WordPress: **ACF** → **Tools** → **Export Field Groups**
2. Select all field groups → **Export as JSON**
3. Save the JSON file
4. In production WordPress: **ACF** → **Tools** → **Import Field Groups**
5. Upload the JSON file

### Step 6: Export/Import Database (Content)

**Option A: Using WordPress Export/Import**
1. Local: **Tools** → **Export** → **All content**
2. Production: **Tools** → **Import** → Upload XML file

**Option B: Using Database Dump (Recommended for full migration)**

```bash
# On local machine (MAMP)
/Applications/MAMP/Library/bin/mysqldump -u root -p takovoberry > takovoberry_backup.sql

# Update URLs in the SQL file
sed -i '' 's|http://localhost:8888/takovoberry|https://cms-takovoberry.orbu.studio|g' takovoberry_backup.sql

# Import on Hostinger via phpMyAdmin or CLI
```

### Step 7: Upload Media Files

1. Zip the uploads folder:
```bash
cd /Applications/MAMP/htdocs/takovoberry/wp-content
zip -r uploads.zip uploads/
```

2. Upload to Hostinger via:
   - File Manager in hPanel
   - FTP client (FileZilla)
   - SSH if available

3. Extract to `/wp-content/uploads/` on server

### Step 8: Configure WordPress Settings

1. **Settings** → **Permalinks** → **Post name** → Save
2. **Languages** (Polylang):
   - Add English (en)
   - Add Serbian (sr) 
   - Set default language
3. **Settings** → **Reading** → Ensure front page is set
4. Test GraphQL: Visit `https://cms-takovoberry.orbu.studio/graphql`

### Step 9: Security Hardening

Add to `wp-config.php`:
```php
// Disable file editing
define('DISALLOW_FILE_EDIT', true);

// Force HTTPS
define('FORCE_SSL_ADMIN', true);

// Limit revisions
define('WP_POST_REVISIONS', 5);
```

---

## Part 2: Next.js Migration (Vercel)

### Step 1: Push Code to GitHub

```bash
# In the frontend directory
cd /Applications/MAMP/htdocs/takovoberry/frontend

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Production ready: Takovoberry Next.js frontend"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/takovoberry-frontend.git

# Push
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your `takovoberry-frontend` repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (or `frontend` if in monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Set Environment Variables in Vercel

Go to **Project Settings** → **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_WORDPRESS_URL` | `https://cms-takovoberry.orbu.studio` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://cms-takovoberry.orbu.studio/graphql` |
| `NEXT_PUBLIC_SITE_NAME` | `Takovoberry` |
| `NEXT_PUBLIC_SITE_URL` | `https://takovoberry.orbu.studio` |

### Step 4: Configure Custom Domain

1. In Vercel project: **Settings** → **Domains**
2. Add domain: `takovoberry.orbu.studio`
3. Vercel will show DNS records to add

### Step 5: Add DNS Records in Hostinger

In hPanel → **DNS Zone**:

| Type | Name | Value |
|------|------|-------|
| CNAME | takovoberry | cname.vercel-dns.com |

Or if using A record:
| Type | Name | Value |
|------|------|-------|
| A | takovoberry | 76.76.21.21 |

### Step 6: Verify Deployment

1. Wait for DNS propagation (up to 48 hours, usually minutes)
2. Visit `https://takovoberry.orbu.studio`
3. Test:
   - [ ] Homepage loads
   - [ ] Language switching works
   - [ ] Images load from WordPress
   - [ ] News pages work
   - [ ] Contact form submits

---

## Part 3: Post-Migration Checklist

### WordPress
- [ ] All plugins activated and configured
- [ ] ACF field groups imported
- [ ] Content imported
- [ ] Media files uploaded
- [ ] Languages configured in Polylang
- [ ] Menus created
- [ ] Contact Form 7 configured with SMTP
- [ ] GraphQL endpoint accessible

### Next.js (Vercel)
- [ ] Build successful
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All pages rendering correctly
- [ ] API routes working (contact form)

### Final Verification
- [ ] Test both languages (EN/SR)
- [ ] Test contact form submission
- [ ] Test all page sections
- [ ] Check mobile responsiveness
- [ ] Verify images loading
- [ ] Check sitemap.xml
- [ ] Check robots.txt
- [ ] Test 404 page

---

## Troubleshooting

### CORS Errors
If you see CORS errors in console:
1. Verify headless theme is active
2. Check `functions.php` has correct frontend URL
3. Clear WordPress cache

### Images Not Loading
1. Check `next.config.ts` has correct hostname
2. Verify uploads folder permissions on server
3. Check image URLs in WordPress are using HTTPS

### GraphQL Errors
1. Test endpoint directly: `https://cms-takovoberry.orbu.studio/graphql`
2. Check WPGraphQL is active
3. Verify ACF to WPGraphQL plugin is active
4. Check field groups are set to "Show in GraphQL"

### Contact Form Not Working
1. Check CF7 form ID matches in WordPress
2. Verify SMTP is configured in WordPress
3. Check API route logs in Vercel

---

## Useful Commands

```bash
# Test build locally with production env
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Test production build locally
npm run build && npm start
```

---

## Support Contacts

- **Vercel Support**: support@vercel.com
- **Hostinger Support**: Via hPanel live chat
- **WPGraphQL Discord**: discord.gg/wpgraphql
