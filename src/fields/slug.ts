import type { Field } from 'payload'

const slugify = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

/**
 * A slug text field that auto-generates from `sourceField` (default: "title")
 * when left blank. Editable in admin and used in public URLs.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Auto-generated from the title if left blank. Used in the page URL.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = data?.[sourceField]
        if (typeof source === 'string' && source.length > 0) return slugify(source)
        return value
      },
    ],
  },
})
