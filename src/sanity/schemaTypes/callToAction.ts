import {defineField, defineType} from 'sanity'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call To Action (Card)',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'headline', subtitle: 'linkUrl', media: 'backgroundImage'},
  },
})

