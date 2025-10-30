import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'template',
  title: 'Template',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Template Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      description: 'Price in dollars (e.g., 99 for $99)',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {
        list: [
          {title: 'US Dollar', value: 'USD'},
          {title: 'Euro', value: 'EUR'},
          {title: 'British Pound', value: 'GBP'},
        ],
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewImages',
      title: 'Preview Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        },
      ],
      description: 'Additional screenshots/preview images',
    }),
    defineField({
      name: 'previewUrl',
      title: 'Live Preview URL',
      type: 'url',
      description: 'URL to live demo of the template',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL (Alternative)',
      type: 'url',
      description: 'Alternative demo URL if different from preview',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Template',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'SaaS', value: 'SaaS'},
          {title: 'E-commerce', value: 'E-commerce'},
          {title: 'Portfolio', value: 'Portfolio'},
          {title: 'Blog', value: 'Blog'},
          {title: 'Landing Page', value: 'Landing Page'},
          {title: 'Dashboard', value: 'Dashboard'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tech stack used (e.g., Next.js, React, Tailwind CSS)',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key features of the template',
    }),
    defineField({
      name: 'demoCredentials',
      title: 'Demo Credentials',
      type: 'object',
      fields: [
        {
          name: 'username',
          type: 'string',
          title: 'Username',
        },
        {
          name: 'password',
          type: 'string',
          title: 'Password',
        },
      ],
      description: 'Login credentials for demo (if applicable)',
    }),
    defineField({
      name: 'licenseType',
      title: 'License Type',
      type: 'string',
      options: {
        list: [
          {title: 'Single Site License', value: 'single'},
          {title: 'Unlimited License', value: 'unlimited'},
          {title: 'Extended License', value: 'extended'},
        ],
      },
      initialValue: 'single',
    }),
    defineField({
      name: 'includes',
      title: "What's Included",
      type: 'array',
      of: [{type: 'string'}],
      description: 'What comes with the purchase (e.g., Source code, Documentation)',
    }),
    defineField({
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
      description: 'Stripe product ID (optional, for advanced integration)',
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      description: 'Stripe price ID (optional, for advanced integration)',
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Download URL',
      type: 'url',
      description: 'External download URL (e.g., GitHub release, cloud storage)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'templateFile',
      title: 'Template File (ZIP)',
      type: 'file',
      options: {
        accept: '.zip',
      },
      description: 'Upload template as ZIP file (alternative to external URL)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'thumbnail',
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Price, Low to High',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
    {
      title: 'Price, High to Low',
      name: 'priceDesc',
      by: [{field: 'price', direction: 'desc'}],
    },
  ],
})
