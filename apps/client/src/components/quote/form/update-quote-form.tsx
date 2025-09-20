import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { Quote, UpdateQuoteData } from '@/types';
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';
import { QuoteFormBody } from '@/components/quote/form/quote-form-body';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema } from '@/components/quote/form/quote-schema';

type UpdateQuoteFormProps = {
  quote: Quote;
  onCancel: (id: number) => void;
};

export const UpdateQuoteForm = React.memo(function UpdateQuoteForm(
  props: UpdateQuoteFormProps,
): JSX.Element {
  const { quote, onCancel } = props;
  const methods = useForm<UpdateQuoteData>({
    values: {
      author: quote.author,
      content: quote.content,
      context: quote.context,
      user: quote.user,
    },
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(quoteSchema),
  });

  const mutation = useUpdateQuoteMutation({
    onSuccess: () => onCancel(quote.id),
  });

  const onSubmit = (data: UpdateQuoteData): void => {
    mutation.mutate({ id: quote.id, data });
  };

  return (
    <Form<UpdateQuoteData>
      className="bg-card flex flex-col rounded border p-2"
      onSubmit={onSubmit}
      methods={methods}
    >
      <QuoteFormBody />
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => onCancel(quote.id)}
          variant="destructive"
        >
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </Form>
  );
});
