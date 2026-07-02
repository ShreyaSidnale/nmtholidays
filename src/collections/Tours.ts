import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Tours: CollectionConfig = {
  slug: 'tours',
  labels: { singular: 'Tour / Package', plural: 'Tours / Packages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'durationDays', 'priceFrom', 'status'],
    group: 'Catalog',
    description: 'Create and manage tour packages. Drag itinerary days to reorder them.',
  },
  access: {
    // Only published tours are visible to the public; admins see everything.
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            slugField('title'),
            {
              name: 'destination',
              type: 'relationship',
              relationTo: 'destinations',
              hasMany: false,
              admin: { description: 'Primary destination/region for this package.' },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: 'Short teaser shown on tour cards and search results.' },
            },
            {
              name: 'overview',
              type: 'richText',
              localized: true,
              admin: { description: 'Full description shown on the tour detail page.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'durationDays', label: 'Days', type: 'number', min: 1, required: true },
                { name: 'durationNights', label: 'Nights', type: 'number', min: 0 },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'priceFrom',
                  label: 'Price from',
                  type: 'number',
                  min: 0,
                  admin: { description: 'Starting price per person.' },
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'INR',
                  options: [
                    { label: '₹ INR', value: 'INR' },
                    { label: '$ USD', value: 'USD' },
                    { label: '€ EUR', value: 'EUR' },
                  ],
                },
              ],
            },
            {
              name: 'themes',
              type: 'select',
              hasMany: true,
              admin: { description: 'Used for filtering on the tours page.' },
              options: [
                { label: 'Honeymoon', value: 'honeymoon' },
                { label: 'Family', value: 'family' },
                { label: 'Adventure', value: 'adventure' },
                { label: 'Beach', value: 'beach' },
                { label: 'Hill Station', value: 'hill-station' },
                { label: 'Pilgrimage', value: 'pilgrimage' },
                { label: 'Wildlife', value: 'wildlife' },
                { label: 'Heritage', value: 'heritage' },
                { label: 'Group Tour', value: 'group' },
                { label: 'MICE / Corporate', value: 'mice' },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Image', plural: 'Gallery Images' },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
          ],
        },
        {
          label: 'Itinerary',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              labels: { singular: 'Day', plural: 'Itinerary Days' },
              admin: {
                description: 'Add a row per day. Drag rows to reorder the itinerary.',
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/ItineraryRowLabel#ItineraryRowLabel',
                },
              },
              fields: [
                { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Arrival in Manali"' } },
                { name: 'description', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  type: 'row',
                  fields: [
                    { name: 'meals', type: 'text', admin: { description: 'e.g. "Breakfast, Dinner"' } },
                    { name: 'stay', label: 'Overnight stay', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'highlights',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'inclusions',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'exclusions',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'faqs',
              type: 'array',
              labels: { singular: 'FAQ', plural: 'FAQs' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
          ],
        },
      ],
    },
    // Sidebar flags
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Highlight on the home page hero/featured strip.' },
    },
    {
      name: 'trending',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show in the "Trending Trips" section.' },
    },
  ],
}
