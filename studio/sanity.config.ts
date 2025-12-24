import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || '6sdtxnoz'
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Deliorman Studio',

  projectId,
  dataset,

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
