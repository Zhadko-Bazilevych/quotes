import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { CreateQuoteData } from '@/types';
import { useCreateQuoteMutation } from '@/hooks/use-create-quote';
import { QuoteFormBody } from '@/components/quote/form/quote-form-body';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema } from '@/components/quote/form/quote-schema';

type CreateQuoteFormProps = {
  onCancel: () => void;
};

export function CreateQuoteForm(props: CreateQuoteFormProps): JSX.Element {
  const { onCancel: toggleEdit } = props;
  const methods = useForm<CreateQuoteData>({
    mode: 'onBlur',
    criteriaMode: 'all',
    resolver: zodResolver(quoteSchema),
  });

  const mutation = useCreateQuoteMutation({
    onSuccess: () => toggleEdit(),
  });

  const onSubmit = (data: CreateQuoteData): void => {
    mutation.mutate({ data });
  };

  return (
    <Form<CreateQuoteData>
      className="bg-card flex flex-col rounded border p-2"
      onSubmit={onSubmit}
      methods={methods}
    >
      <QuoteFormBody />
      <div className="flex justify-end gap-3">
        <Button type="button" onClick={toggleEdit} variant="destructive">
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </Form>
  );
}
