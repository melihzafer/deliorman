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
      name: 'weight',
      title: 'Weight / Amount',
      type: 'string',
      description: 'E.g. 250 ml, 500 g, etc.',
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
          {title: 'Безалкохолни и Топли Напитки', value: 'Безалкохолни и Топли Напитки'},
          {title: 'Салати', value: 'Салати'},
          {title: 'Новите Специалитети', value: 'Новите Специалитети'},
          // Може да добавите още категории тук по-късно
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', weight: 'weight'},
    prepare({title, subtitle, weight}) {
      return {
        title,
        subtitle: weight ? `${weight} | ${subtitle}` : subtitle,
      }
    },
  },
})
