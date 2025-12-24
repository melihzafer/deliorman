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
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {name: 'icon', type: 'string', title: 'Icon Class (e.g. fas fa-award)'},
                        {name: 'title', type: 'string', title: 'Feature Title'},
                        {name: 'text', type: 'string', title: 'Feature Description'},
                    ],
                    preview: {
                        select: {title: 'title', subtitle: 'text'},
                    },
                },
            ],
        }),
        defineField({
            name: 'buttonLink',
            title: 'Button Link',
            type: 'string',
            description: 'Optional custom button link (defaults to /menu)',
        }),
        defineField({
            name: 'buttonLabel',
            title: 'Button Label',
            type: 'string',
            description: 'Optional custom button text',
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