import { QuoteCard } from '@/components/quote/quote-card';
import { UpdateQuoteForm } from '@/components/quote/form/update-quote-form';
import { QuotePaginationBar } from '@/components/quote/quote-pagination-bar';
import { useCallback, useEffect, useState, type JSX } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { QuoteListSkeleton } from '@/components/quote/skeleton/quote-list-skeleton';
import { UnexpectedError } from '@/components/ui/unexpected-error';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { quoteListRoute } from '@/routes/route-tree';
import { addEventListenerWithCleaup } from '@/utils/add-event-listener';
import { QuoteSearch } from '@/components/quote/quote-search';
import { QuoteOrder } from './quote-order';
import { keepPreviousData } from '@tanstack/react-query';

export function QuoteListSection(): JSX.Element {
  const navigate = useNavigate({
    from: quoteListRoute.fullPath,
  });
  const { pageSize, page, q, sort } = useSearch({
    from: quoteListRoute.fullPath,
  });
  const { data, isError, isFetching, isPlaceholderData, isLoading } = useQuotes(
    {
      pagination: { pageSize, page },
      filter: { q },
      sort,
    },
    { placeholderData: keepPreviousData },
  );
  const isFetchingNewData = isLoading || (isFetching && isPlaceholderData);

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
    if (!isQuoteListVisible || !data) {
      return;
    }

    return addEventListenerWithCleaup('keydown', (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) {
        return;
      }

      if (e.key === 'ArrowRight') {
        void navigate({
          search: (prev) => ({
            ...prev,
            page: Math.min(page + 1, data.totalPages),
          }),
        });
      }
      if (e.key === 'ArrowLeft') {
        void navigate({
          search: (prev) => ({
            ...prev,
            page: Math.max(1, page - 1),
          }),
        });
      }
    });
  }, [isQuoteListVisible, navigate, page, pageSize, data]);

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
      <QuoteSearch placeholder="Search quotes..." />
      <QuoteOrder />
      {isFetchingNewData && <QuoteListSkeleton pageSize={pageSize} />}
      {!isFetchingNewData &&
        data?.data.map((quote) => {
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
          total={data.total}
          page={page}
          pageSize={pageSize}
          totalPages={data.totalPages}
        />
      )}
    </section>
  );
}
