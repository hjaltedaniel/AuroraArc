import type { JournalEntry } from '~~/shared/types/content'

const DEFAULT: JournalEntry[] = [
  {
    id: 'e6918e0c',
    title: 'Crossing the Ice: 14 Days on the Vatnajökull Glacier',
    excerpt: "Our team put the Arc Navigator Pro through its paces on one of Europe's most demanding ice fields. Here's what we learned.",
    tag: 'Expedition Report',
    tagColor: 'teal',
    publishDate: '2025-11-15',
    bodyMarkup: '',
  },
  {
    id: 'b0b9eafd',
    title: 'The Future of Trail Navigation is AI',
    excerpt: 'How machine learning is transforming how we move through wilderness environments — and what it means for gear design.',
    tag: 'Technology',
    tagColor: 'violet',
    publishDate: '2025-10-22',
    bodyMarkup: '',
  },
  {
    id: 'b2127949',
    title: 'Leave No Trace, Leave Better Tech',
    excerpt: "Sustainability isn't just about materials. We explore how low-power design and repairability are reshaping expedition electronics.",
    tag: 'Sustainability',
    tagColor: 'glacier',
    publishDate: '2025-09-30',
    bodyMarkup: '',
  },
]

export function useCmsJournal() {
  return useFetch<JournalEntry[]>('/api/cms/journal', {
    key: 'cms:journal',
    default: () => DEFAULT,
  })
}
