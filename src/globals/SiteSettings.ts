import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'NMT India Holidays' },
            { name: 'tagline', type: 'text', defaultValue: 'Sirf Trip Nahi, Memories Banao' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', type: 'text' },
            {
              name: 'whatsappNumber',
              type: 'text',
              admin: {
                description: 'Digits only, with country code, e.g. 919876543210 (no + or spaces).',
              },
            },
            {
              name: 'whatsappMessageTemplate',
              type: 'text',
              defaultValue: 'Hi NMT India Holidays! I would like to know more about {tour}.',
              admin: { description: 'Use {tour} as a placeholder for the tour name.' },
            },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'textarea' },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'youtube', type: 'text' },
          ],
        },
        {
          label: 'Home Hero',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              labels: { singular: 'Slide', plural: 'Hero Slides' },
              admin: { description: 'Rotating background images on the home hero.' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'heading', type: 'text' },
                { name: 'subheading', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
