import { fetchLandingPage } from '~~/server/utils/composeContent'

export default defineEventHandler(async () => {
  return fetchLandingPage()
})
