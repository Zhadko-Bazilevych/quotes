import { QuoteCard } from '@/components/quote/quote-card';
import { UpdateQuoteForm } from '@/components/quote/form/update-quote-form';
import { QuotePaginationBar } from '@/components/quote/quote-pagination-bar';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { QuoteListSkeleton } from '@/components/quote/skeleton/quote-list-skeleton';
import { UnexpectedError } from '@/components/ui/unexpected-error';
import { quoteListRoute } from '@/routes/route-tree';
import { addEventListenerWithCleaup } from '@/utils/add-event-listener';
import { QuoteSearch } from '@/components/quote/quote-search';
import { QuoteOrder } from './quote-order';
import { useModalStore } from '@/stores/modal-store';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import type { QuoteList } from '@/types/quotes';
import { queries } from '@/api';

export function QuoteListSection(): JSX.Element {
  const navigate = quoteListRoute.useNavigate();
  const isAnyModalOpen = useModalStore((s) => s.isAnyModalOpen);
  const { pageSize, page, q, sort } = quoteListRoute.useSearch();
  const quoteListParams = useMemo(
    () => ({
      pagination: { pageSize, page },
      filter: { q },
      sort,
    }),
    [pageSize, page, q, sort],
  );
  const { data, isError, isFetching, isPlaceholderData, isLoading } = useQuotes(
    quoteListParams,
    { placeholderData: keepPreviousData },
  );
  const isFetchingNewData = isLoading || (isFetching && isPlaceholderData);

  const [editingIds, setEditingIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const toggleEdit = useCallback(
    (id: number): void => {
      setEditingIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [setEditingIds],
  );

  const onDelete = useCallback(
    (id: number) => {
      queryClient.setQueryData<QuoteList>(
        queries.quotes.getList(quoteListParams).queryKey,
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            data: old.data.filter((q) => q.id !== id),
          };
        },
      );
    },
    [queryClient, quoteListParams],
  );

  useEffect(() => {
    if (isAnyModalOpen || !data) {
      return;
    }

    // TODO: add useHotkeys hook
    return addEventListenerWithCleaup('keydown', (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) {
        return;
      }
      const el = document.activeElement;
      if (!el) {
        return;
      }

      const isEditableElementFocused =
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        (el as HTMLElement).isContentEditable;

      if (isEditableElementFocused) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        void navigate({
          search: (prev) => ({
            ...prev,
            page: Math.min(page + 1, data.totalPages),
          }),
        });
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        void navigate({
          search: (prev) => ({
            ...prev,
            page: Math.max(1, page - 1),
          }),
        });
      }
    });
  }, [isAnyModalOpen, navigate, page, pageSize, data]);

  useEffect(() => {
    if (isAnyModalOpen) {
      return;
    }

    return addEventListenerWithCleaup('keydown', (event) => {
      if (event.key === 'Escape') {
        setEditingIds((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
      }
    });
  }, [setEditingIds, isAnyModalOpen]);

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
              onDelete={onDelete}
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
