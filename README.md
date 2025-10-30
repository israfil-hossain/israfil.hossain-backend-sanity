# Flowentech Portfolio & Template Marketplace - Sanity Backend

This is the Sanity Content Studio backend for the Flowentech portfolio and template marketplace. It manages content for blog posts, projects, job experiences, and the template marketplace.

## Features

- **Portfolio Content**: Manage blog posts, projects, job experiences, and profile information
- **Template Marketplace**: Full schema support for selling digital templates with Stripe integration
- **Purchase Management**: Track customer purchases, licenses, and download tokens

## Schema Types

### Portfolio Schemas
- `author` - Blog post authors
- `category` - Content categories
- `post` - Blog posts
- `job` - Work experience entries
- `profile` - Profile information
- `project` - Portfolio projects

### Template Marketplace Schemas
- `template` - Digital templates for sale (pricing, features, files, preview images)
- `purchase` - Customer purchase records (Stripe integration, license keys, download tokens)

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `SANITY_PROJECT_ID` - Your Sanity project ID (already set: ab0ypbx5)
- `SANITY_DATASET` - Dataset name (production)
- `SANITY_API_TOKEN` - API token with write permissions (for webhooks)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `APP_URL` - Your application URL

### 3. Deploy Schemas

```bash
pnpm deploy
```

### 4. Start Development Server

```bash
pnpm dev
```

The Studio will be available at `http://localhost:3333`

## Template Marketplace Setup

### Sanity Configuration

1. **Generate API Token**:
   - Go to https://sanity.io/manage
   - Select your project
   - Navigate to API → Tokens
   - Create a token with "Editor" permissions
   - Add to your `.env.local` as `SANITY_API_TOKEN`

2. **Configure CORS**:
   - Go to API → CORS Origins
   - Add your frontend URLs:
     - `http://localhost:3000` (development)
     - Your production domain

### Stripe Configuration

1. **Create Products**:
   - Create products in Stripe Dashboard
   - Copy Product ID and Price ID to template documents
   - Or let the system create products dynamically

2. **Setup Webhook**:
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy signing secret to `.env.local`

3. **Test Locally**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Content Management

### Adding Templates

1. Go to Content → Template
2. Fill in template details:
   - Name, description, price
   - Upload thumbnail and preview images
   - Add demo URL and preview URL
   - Upload ZIP file or provide download URL
   - Add features, technologies, and included items
3. Publish the template

### Managing Purchases

Purchase records are created automatically via Stripe webhooks when customers complete checkout. Each purchase includes:
- Customer email
- License key
- Download token (with expiration)
- Payment details

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm deploy` - Deploy studio to Sanity

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [Stripe Integration Guide](https://stripe.com/docs/payments/checkout)
