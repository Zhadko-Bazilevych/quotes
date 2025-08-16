import { QuoteCard as BaseQuoteCard } from '@/components/quote/quote-card';
import { UpdateQuoteForm as BaseUpdateQuoteForm } from '@/components/quote/form/update-quote-form';
import { useCallback, useState, type JSX } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import React from 'react';
import { QuoteListSkeleton } from '@/components/quote/skeleton/quote-list-skeleton';
import { UnexpectedError } from '@/components/ui/unexpected-error';
import { PaginationBar } from '@/components/quote/pagination-bar';

const UpdateQuoteForm = React.memo(BaseUpdateQuoteForm);
const QuoteCard = React.memo(BaseQuoteCard);

const pageSize = 10;

export function QuoteListSection(): JSX.Element {
  const [editingIds, setEditingIds] = useState<number[]>([]);

  const { data, isLoading, isError } = useQuotes({
    size: pageSize,
    page: 1,
  });

  const toggleEdit = useCallback(
    (id: number): void => {
      setEditingIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [setEditingIds],
  );

  if (isError) {
    return <UnexpectedError />;
  }

  return (
    <section className="flex flex-col gap-3">
      {isLoading && <QuoteListSkeleton pageSize={pageSize} />}
      {data?.quotes.map((quote) => {
        if (editingIds.includes(quote.id)) {
          return (
            <UpdateQuoteForm
              key={quote.id}
              quote={quote}
              onCancel={toggleEdit}
            />
          );
        }

        return <QuoteCard key={quote.id} quote={quote} onEdit={toggleEdit} />;
      })}
      {data?.total && (
        <PaginationBar
          page={1}
          totalPages={Math.ceil(data.total / pageSize)}
          onClick={() => {}}
        ></PaginationBar>
      )}
    </section>
  );
}
