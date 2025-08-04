
import { defineConfig } from 'sanity'
import post from './schemas/post'
import callout from './schemas/callout'

export default defineConfig({
  name: 'default',
  title: 'Framer Support Docs',
  projectId: 'your_project_id',
  dataset: 'production',
  schema: {
    types: [post, callout],
  },
})
