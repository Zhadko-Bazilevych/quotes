import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { QuoteFormBody } from '@/components/quote/form/quote-form-body';
import { quoteSchema } from '@/components/quote/form/quote-schema';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreateQuoteMutation } from '@/hooks/use-create-quote';
import type { CreateQuoteData } from '@/types/quote';

export type CreateQuoteFormProps = {
  onCancel: () => void;
};

export function CreateQuoteForm(props: CreateQuoteFormProps): JSX.Element {
  const { onCancel: toggleEdit } = props;
  const form = useForm<CreateQuoteData>({
    defaultValues: {
      author: '',
      content: '',
      context: '',
      user: '',
    },
    mode: 'onTouched',
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
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="bg-card flex flex-col rounded border p-2"
      >
        <QuoteFormBody />
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={toggleEdit} variant="destructive">
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
