import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { Quote, UpdateQuoteData } from '@/types';
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';
import { QuoteFormBody } from '@/components/quote-form-body';
import { Form } from '@/components/form';

type UpdateQuoteFormProps = {
  quote: Quote;
  onCancel: () => void;
};

export function UpdateQuoteForm(props: UpdateQuoteFormProps): JSX.Element {
  const { quote, onCancel: toggleEdit } = props;
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
    onSuccess: () => toggleEdit(),
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
        <Button type="button" onClick={toggleEdit}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
