export const interiors = {
  name: 'interiors', // Matches your JS category for WhatsApp logic
  title: 'Interiors (Portfolio)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Project Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Lekki Phase 1, Victoria Island',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      description: 'e.g. ₦250k - ₦400k',
    },
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text (SEO)',
          description: 'Describe the project space for Google.',
          validation: Rule => Rule.required()
        }
      ]
    },
  ]
}