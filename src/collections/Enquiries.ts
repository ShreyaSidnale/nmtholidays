import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'source', 'tour', 'createdAt'],
    group: 'Leads',
    description: 'Contact form and tour enquiry submissions captured from the website.',
  },
  access: {
    // Anyone can submit (create); only logged-in admins can read/update/delete.
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea' },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      admin: { description: 'Set when the enquiry came from a specific tour page.' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'contact',
      options: [
        { label: 'Contact form', value: 'contact' },
        { label: 'Tour enquiry', value: 'tour' },
        { label: 'Plan my trip', value: 'plan-trip' },
      ],
    },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Mark once the lead has been followed up.' },
    },
  ],
}
