import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { Quote, UpdateQuoteData } from '@/types';
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';
import { QuoteFormBody } from '@/components/quote/form/quote-form-body';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

type UpdateQuoteFormProps = {
  quote: Quote;
  onCancel: (id: number) => void;
};

export function UpdateQuoteForm(props: UpdateQuoteFormProps): JSX.Element {
  const { quote, onCancel } = props;
  const methods = useForm<UpdateQuoteData>({
    values: {
      author: quote.author,
      content: quote.content,
      context: quote.context,
      user: quote.user,
    },
    mode: 'all',
    criteriaMode: 'firstError',
  });

  const mutation = useUpdateQuoteMutation({
    onSuccess: () => onCancel(quote.id),
  });

  const onSubmit = (data: UpdateQuoteData): void => {
    mutation.mutate({ id: quote.id, data });
  };

  return (
    <Form<UpdateQuoteData>
      className="flex flex-col border rounded border-gray-300 p-2"
      onSubmit={onSubmit}
      methods={methods}
    >
      <QuoteFormBody />
      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={() => onCancel(quote.id)}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
