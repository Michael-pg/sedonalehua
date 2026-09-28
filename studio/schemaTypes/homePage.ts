import {defineArrayMember, defineField, defineType} from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'readyToWear', title: 'Ready-to-Wear'},
    {name: 'statement', title: 'Statement'},
    {name: 'journal', title: 'Journal strip'},
    {name: 'about', title: 'About'},
  ],
  fields: [
    // Hero ------------------------------------------------------------------
    defineField({
      name: 'heroTitle',
      title: 'Title',
      type: 'string',
      group: 'hero',
      initialValue: 'Sedona Lehua',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Background video (desktop, 16:9)',
      type: 'file',
      group: 'hero',
      options: {accept: 'video/mp4'},
      description:
        'Silent H.264 MP4, ideally under 4 MB. See scripts/encode-hero.sh.',
    }),
    defineField({
      name: 'heroVideoMobile',
      title: 'Background video (mobile, 9:16)',
      type: 'file',
      group: 'hero',
      options: {accept: 'video/mp4'},
    }),
    defineField({
      name: 'heroPoster',
      title: 'Poster image',
      type: 'editorialImage',
      group: 'hero',
      description:
        'Shown before the video loads and for reduced-motion visitors.',
    }),
    defineField({
      name: 'heroLayers',
      title: 'Layered images',
      type: 'array',
      group: 'hero',
      description:
        'Images floated over the video (e.g. the hibiscus, the cliffs).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroLayer',
          fields: [
            defineField({name: 'image', type: 'editorialImage'}),
            defineField({
              name: 'opacity',
              type: 'number',
              initialValue: 0.6,
              validation: (r) => r.min(0).max(1),
            }),
            defineField({
              name: 'blend',
              title: 'Blend mode',
              type: 'string',
              initialValue: 'normal',
              options: {
                list: [
                  'normal',
                  'multiply',
                  'screen',
                  'overlay',
                  'soft-light',
                  'luminosity',
                ],
              },
            }),
            defineField({
              name: 'placement',
              type: 'string',
              initialValue: 'left',
              options: {list: ['left', 'right', 'full']},
            }),
          ],
          preview: {
            select: {
              media: 'image',
              blend: 'blend',
              opacity: 'opacity',
              placement: 'placement',
            },
            prepare: ({media, blend, opacity, placement}) => ({
              media,
              title: `${placement} · ${blend} · ${Math.round((opacity ?? 1) * 100)}%`,
            }),
          },
        }),
      ],
    }),

    // Ready-to-Wear ---------------------------------------------------------
    defineField({
      name: 'readyToWearHeading',
      title: 'Heading',
      type: 'string',
      group: 'readyToWear',
      initialValue: 'Ready-to-Wear',
      description: 'Products in this row come from the store (Shopify).',
    }),

    // Statement -------------------------------------------------------------
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      rows: 3,
      group: 'statement',
      description: 'Wrap words in *asterisks* to set them in italic.',
    }),
    defineField({
      name: 'statementImages',
      title: 'Inline images',
      type: 'array',
      group: 'statement',
      of: [defineArrayMember({type: 'editorialImage'})],
      validation: (r) => r.max(2),
    }),

    // Journal strip ---------------------------------------------------------
    defineField({
      name: 'journalEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'journal',
    }),
    defineField({
      name: 'journalTitle',
      title: 'Title',
      type: 'string',
      group: 'journal',
    }),
    defineField({
      name: 'journalIssue',
      title: 'Issue number',
      type: 'string',
      group: 'journal',
    }),
    defineField({
      name: 'journalImages',
      title: 'Images',
      type: 'array',
      group: 'journal',
      of: [defineArrayMember({type: 'editorialImage'})],
    }),

    // About -----------------------------------------------------------------
    defineField({
      name: 'aboutHeading',
      title: 'Heading',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutBody',
      title: 'Body',
      type: 'text',
      rows: 5,
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'Image',
      type: 'editorialImage',
      group: 'about',
    }),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
});
