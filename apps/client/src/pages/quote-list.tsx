import type { JSX } from 'react';

import { AddQuoteSection } from '@/components/quote/add-quote-section';
import { QuoteListSection } from '@/components/quote/quote-list-section';

export function QuoteList(): JSX.Element {
  return (
    <section className="flex flex-col gap-3">
      <AddQuoteSection />
      <QuoteListSection />
    </section>
  );
}
