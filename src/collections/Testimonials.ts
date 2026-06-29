import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'rating', 'published'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'location', type: 'text' },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      admin: { description: 'Optional: link the review to a specific tour.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
