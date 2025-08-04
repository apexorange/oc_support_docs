
export default {
  name: 'callout',
  type: 'object',
  fields: [
    { name: 'content', type: 'string', title: 'Text' },
    {
      name: 'style',
      type: 'string',
      title: 'Style',
      options: { list: ['info', 'warning', 'success'] }
    }
  ]
}
