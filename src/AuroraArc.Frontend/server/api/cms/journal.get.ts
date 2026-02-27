import { fetchJournalEntries } from '~~/server/utils/composeContent'

export default defineEventHandler(async () => {
  return fetchJournalEntries()
})
