# Template Marketplace Setup Guide

This guide provides detailed instructions for setting up the template marketplace feature in your Sanity Studio and Next.js application.

## Table of Contents

1. [Sanity Schema Overview](#sanity-schema-overview)
2. [Environment Setup](#environment-setup)
3. [Sanity Configuration](#sanity-configuration)
4. [Stripe Integration](#stripe-integration)
5. [Frontend Integration](#frontend-integration)
6. [Testing](#testing)

## Sanity Schema Overview

### Template Schema
The `template` schema includes:
- Basic info (name, slug, description)
- Pricing (price, currency, license type)
- Media (thumbnail, preview images)
- Demo URLs (live preview, demo credentials)
- Features (technologies, features list, what's included)
- Downloads (ZIP file or external URL)
- Stripe integration (product ID, price ID)

### Purchase Schema
The `purchase` schema tracks:
- Customer information (email)
- Payment details (Stripe session/payment intent, amount)
- License information (license key, download token)
- Download access (token, expiration timestamp)
- Status (completed, pending, refunded)

## Environment Setup

### 1. Backend (.env.local in Sanity Studio)

```bash
# Sanity
SANITY_PROJECT_ID=ab0ypbx5
SANITY_DATASET=production
SANITY_API_TOKEN=your-write-access-token

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# App
APP_URL=http://localhost:3000
```

### 2. Frontend (.env.local in Next.js)

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=ab0ypbx5
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-access-token

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Sanity Configuration

### 1. Generate API Token

1. Go to [Sanity Management Console](https://sanity.io/manage)
2. Select your project: **Flowentech Admin** (ab0ypbx5)
3. Navigate to **API** → **Tokens**
4. Click **Add API Token**
5. Name: "Template Marketplace Webhook"
6. Permissions: **Editor** (needed to create purchase records)
7. Copy the token and add to `.env.local`

### 2. Configure CORS

1. In Sanity Management Console, go to **API** → **CORS Origins**
2. Add these origins:
   - `http://localhost:3000` (development)
   - Your production domain (e.g., `https://flowentech.com`)
3. Allow credentials: **Yes**

### 3. Deploy Schema

```bash
cd /path/to/israfil-portfolio-backend
pnpm install
pnpm deploy
```

This will:
- Validate your schemas
- Deploy to Sanity
- Make the new content types available in Studio

## Stripe Integration

### 1. Create Stripe Account

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete account verification
3. Get your API keys from **Developers** → **API Keys**

### 2. Setup Products (Two Options)

#### Option A: Manual Product Creation
1. Go to **Products** in Stripe Dashboard
2. Click **Add Product**
3. Fill in details matching your template
4. Copy **Product ID** and **Price ID**
5. Add these to your Sanity template document

#### Option B: Dynamic Product Creation (Recommended)
Your Next.js API will automatically create Stripe products when needed.
Just ensure price is set correctly in Sanity.

### 3. Configure Webhook

#### For Development (Local Testing)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (starts with `whsec_`) to your `.env.local`

#### For Production
1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded` (optional)
5. Copy the **Signing secret** to your production environment variables

## Frontend Integration

### 1. Install Dependencies

```bash
cd /path/to/your-nextjs-app
pnpm install @stripe/stripe-js stripe next-sanity
```

### 2. Create API Routes

Your Next.js app needs these API routes:

#### `/api/checkout` - Create Checkout Session
```typescript
// Creates Stripe checkout session for a template
POST /api/checkout
Body: { templateId: string }
Returns: { sessionId: string }
```

#### `/api/webhooks/stripe` - Handle Stripe Events
```typescript
// Receives Stripe webhook events
POST /api/webhooks/stripe
Headers: { stripe-signature: string }
```

#### `/api/download/[token]` - Secure Downloads
```typescript
// Validates token and provides download
GET /api/download/[token]
Returns: File or redirect to download URL
```

### 3. Sanity Queries

Example queries for your frontend:

```typescript
// Get all templates
const templatesQuery = `*[_type == "template"] | order(publishedAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  currency,
  thumbnail,
  category,
  isFeatured,
  technologies
}`

// Get single template
const templateQuery = `*[_type == "template" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  price,
  currency,
  thumbnail,
  previewImages,
  previewUrl,
  demoUrl,
  category,
  technologies,
  features,
  demoCredentials,
  licenseType,
  includes,
  publishedAt
}`

// Verify purchase (server-side only)
const purchaseQuery = `*[_type == "purchase"
  && downloadToken == $token
  && expiresAt > $now][0] {
  _id,
  templateId,
  customerEmail,
  licenseKey,
  expiresAt
}`
```

## Testing

### 1. Test Schema Deployment

```bash
cd israfil-portfolio-backend
pnpm dev
```

Open http://localhost:3333 and verify:
- "Template" appears in content types
- "Purchase" appears in content types
- You can create a test template

### 2. Test Stripe Integration

1. Create a test template in Sanity Studio
2. Use Stripe test mode (keys starting with `pk_test_` / `sk_test_`)
3. Test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
4. Complete a test purchase
5. Verify purchase record is created in Sanity

### 3. Test Download Flow

1. Complete a test purchase
2. Check purchase record for `downloadToken`
3. Test download URL: `http://localhost:3000/api/download/[token]`
4. Verify file downloads or redirects correctly
5. Test expired token (modify `expiresAt` to past date)

## Deployment Checklist

- [ ] Deploy Sanity schemas: `pnpm deploy`
- [ ] Set production environment variables
- [ ] Configure production CORS origins in Sanity
- [ ] Set up production Stripe webhook
- [ ] Test with Stripe test mode
- [ ] Switch to Stripe live mode
- [ ] Test live payment (small amount)
- [ ] Set up monitoring for webhook failures
- [ ] Configure email notifications for purchases

## Common Issues

### Issue: Webhook signature verification fails
**Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret, not your API key.

### Issue: CORS errors when fetching from Sanity
**Solution**: Add your domain to CORS origins in Sanity Management Console.

### Issue: Purchase record not created
**Solution**:
1. Check webhook endpoint is accessible
2. Verify API token has Editor permissions
3. Check webhook logs in Stripe Dashboard

### Issue: Download token expired
**Solution**: Tokens expire after 7 days by default. Adjust `expiresAt` calculation in webhook handler.

## Support

- [Sanity Documentation](https://www.sanity.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Validate webhook signatures** to prevent fake requests
3. **Use HTTPS** in production for webhook endpoints
4. **Set reasonable token expiration** for downloads
5. **Rate limit** your API endpoints
6. **Validate user inputs** on both client and server
7. **Store sensitive files** securely (use signed URLs)
