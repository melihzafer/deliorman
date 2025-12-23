import {defineField, defineType} from 'sanity'

/**
 * menuItem
 * Strict: TEXT ONLY. No images.
 */
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Category label (migrated from legacy JSON category.name)',
      options: {
        list: [
          // Keep this list small; you can expand later in Studio.
          {title: 'Безалкохолни и Топли Напитки', value: 'Безалкохолни и Топли Напитки'},
          {title: 'Салати', value: 'Салати'},
          {title: 'Новите Специалитети', value: 'Новите Специалитети'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category'},
    prepare({title, subtitle}) {
      return {title, subtitle}
    },
  },
})

