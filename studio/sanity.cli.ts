import {defineCliConfig} from 'sanity/cli'
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'PLEASE_SET_PROJECT_ID',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})

