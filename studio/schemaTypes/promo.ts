import {defineField, defineType} from 'sanity'

export const promo = defineType({
    name: 'promo',
    title: 'Promo',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {hotspot: true},
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            description: 'Optional. If empty, promo is treated as unscheduled/draft in frontend logic.',
        }),
    ],
    preview: {
        select: {title: 'title', media: 'image', startDate: 'startDate', endDate: 'endDate'},
        prepare({title, media, startDate, endDate}) {
            const range = [startDate, endDate].filter(Boolean).join(' → ')
            return {title, subtitle: range || 'No date range', media}
        },
    },
})