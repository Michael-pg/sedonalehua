import {defineField, defineType} from 'sanity';

/** An image with hotspot/crop and alt text, used across editorial sections. */
export const editorialImage = defineType({
  name: 'editorialImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers.',
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
});
