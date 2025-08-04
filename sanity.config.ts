
import { defineConfig } from 'sanity'
import post from './schemas/post'
import callout from './schemas/callout'

export default defineConfig({
  name: 'default',
  title: 'OC Support Docs',
  projectId: 'pnh8ldvf',
  dataset: 'production',
  schema: {
    types: [post, callout],
  },
})