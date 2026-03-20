export const homes = {
  name: 'homes',
  title: 'Homes (Retail Items)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
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
      title: 'Product Image',
      type: 'image',
      description: 'Image must have a square shape, and should not be more than 500kb',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text (SEO)',
          description: 'Describe the image in details for search engines.',
          validation: Rule => Rule.required().error('You need alt text for SEO, man.')
        }
      ]
    }
  ]
}