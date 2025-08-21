import { QuoteCard as BaseQuoteCard } from '@/components/quote/quote-card';
import { UpdateQuoteForm as BaseUpdateQuoteForm } from '@/components/quote/form/update-quote-form';
import { QuotePaginationBar as BaseQuotePaginationBar } from '@/components/quote/quote-pagination-bar';
import { useCallback, useEffect, useState, type JSX } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import React from 'react';
import { QuoteListSkeleton } from '@/components/quote/skeleton/quote-list-skeleton';
import { UnexpectedError } from '@/components/ui/unexpected-error';
import { useSearch } from '@tanstack/react-router';
import { quoteListRoute } from '@/routes/route-tree';
import { addEventListenerWithCleaup } from '@/utils/add-event-listener';
import { keepPreviousData } from '@tanstack/react-query';

const UpdateQuoteForm = React.memo(BaseUpdateQuoteForm);
const QuoteCard = React.memo(BaseQuoteCard);
const QuotePaginationBar = React.memo(BaseQuotePaginationBar);

export function QuoteListSection(): JSX.Element {
  const { size, page } = useSearch({
    from: quoteListRoute.fullPath,
  });
  const { data, isError, isSuccess, isLoading } = useQuotes(
    {
      size,
      page,
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  const [isQuoteListVisible, setIsQuoteListVisible] = useState(true);

  const [editingIds, setEditingIds] = useState<number[]>([]);

  const toggleEdit = useCallback(
    (id: number): void => {
      setEditingIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [setEditingIds],
  );

  useEffect(() => {
    if (!isQuoteListVisible) {
      return;
    }

    return addEventListenerWithCleaup('keydown', (event) => {
      if (event.key === 'Escape') {
        setEditingIds((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
      }
    });
  }, [setEditingIds, isQuoteListVisible]);

  if (isError) {
    return <UnexpectedError />;
  }

  return (
    <section className="flex flex-col gap-3">
      {isLoading && <QuoteListSkeleton pageSize={size} />}
      {isSuccess &&
        data.data.map((quote) => {
          if (editingIds.includes(quote.id)) {
            return (
              <UpdateQuoteForm
                key={quote.id}
                quote={quote}
                onCancel={toggleEdit}
              />
            );
          }

          return (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onEdit={toggleEdit}
              setIsQuoteListVisible={setIsQuoteListVisible}
            />
          );
        })}
      {data && (
        <QuotePaginationBar
          page={page}
          size={size}
          totalPages={data.totalPages}
        />
      )}
    </section>
  );
}
