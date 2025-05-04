import { defineField, defineType } from 'sanity'
import { BulbOutlineIcon } from "@sanity/icons";

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'stack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),

    // New fields
    defineField({
      name: 'isRunning',
      title: 'Is Running',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showPortfolio',
      title: 'Show in Portfolio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'needInvestment',
      title: 'Needs Investment',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
