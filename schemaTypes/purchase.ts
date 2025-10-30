import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'purchase',
  title: 'Purchase',
  type: 'document',
  fields: [
    defineField({
      name: 'templateId',
      title: 'Template ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Reference to the purchased template',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
    }),
    defineField({
      name: 'amount',
      title: 'Amount Paid',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'usd',
    }),
    defineField({
      name: 'downloadToken',
      title: 'Download Token',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique token for secure download',
    }),
    defineField({
      name: 'licenseKey',
      title: 'License Key',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'License key for the customer',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Download Link Expires At',
      type: 'number',
      validation: (Rule) => Rule.required(),
      description: 'Unix timestamp when download link expires',
    }),
    defineField({
      name: 'purchaseDate',
      title: 'Purchase Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Completed', value: 'completed'},
          {title: 'Pending', value: 'pending'},
          {title: 'Refunded', value: 'refunded'},
        ],
      },
      initialValue: 'completed',
    }),
  ],
  preview: {
    select: {
      email: 'customerEmail',
      date: 'purchaseDate',
      amount: 'amount',
      currency: 'currency',
    },
    prepare({email, date, amount, currency}) {
      return {
        title: email,
        subtitle: `${amount} ${currency?.toUpperCase()} - ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
  orderings: [
    {
      title: 'Purchase Date, New',
      name: 'purchaseDateDesc',
      by: [{field: 'purchaseDate', direction: 'desc'}],
    },
  ],
})
