import { fetchSiteSettings } from '~~/server/utils/composeContent'

export default defineEventHandler(async () => {
  return fetchSiteSettings()
})
