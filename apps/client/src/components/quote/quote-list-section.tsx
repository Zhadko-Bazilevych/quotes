import { QuoteCard as BaseQuoteCard } from '@/components/quote/quote-card';
import { UpdateQuoteForm as BaseUpdateQuoteForm } from '@/components/quote/form/update-quote-form';
import { QuotePaginationBar as BaseQuotePaginationBar } from '@/components/quote/quote-pagination-bar';
import { useCallback, useEffect, useState, type JSX } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import React from 'react';
import { QuoteListSkeleton } from '@/components/quote/skeleton/quote-list-skeleton';
import { UnexpectedError } from '@/components/ui/unexpected-error';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { quoteListRoute } from '@/routes/route-tree';
import { addEventListenerWithCleaup } from '@/utils/add-event-listener';
import { Search } from '@/components/ui/search';

const UpdateQuoteForm = React.memo(BaseUpdateQuoteForm);
const QuoteCard = React.memo(BaseQuoteCard);
const QuotePaginationBar = React.memo(BaseQuotePaginationBar);

export function QuoteListSection(): JSX.Element {
  const navigate = useNavigate({
    from: quoteListRoute.fullPath,
  });
  const { pageSize, page, q } = useSearch({
    from: quoteListRoute.fullPath,
  });
  const { data, isError, isLoading } = useQuotes({
    pagination: { pageSize, page },
    filter: { q },
  });

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
      <Search placeholder="Search quotes..." />
      {isLoading && <QuoteListSkeleton pageSize={pageSize} />}
      {data &&
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
          total={data.total}
          page={page}
          pageSize={pageSize}
          totalPages={data.totalPages}
        />
      )}
    </section>
  );
}
