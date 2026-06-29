import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: { singular: 'Destination', plural: 'Destinations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'featured'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'domestic',
      options: [
        { label: 'Domestic (India)', value: 'domestic' },
        { label: 'International', value: 'international' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: { description: 'One or two lines shown on destination cards.' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this destination in the "Explore Destinations" section on the home page.',
      },
    },
  ],
}
