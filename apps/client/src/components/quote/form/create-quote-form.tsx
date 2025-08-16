import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { CreateQuoteData } from '@/types';
import { useCreateQuoteMutation } from '@/hooks/use-create-quote';
import { QuoteFormBody } from '@/components/quote/form/quote-form-body';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

type CreateQuoteFormProps = {
  onCancel: () => void;
};

export function CreateQuoteForm(props: CreateQuoteFormProps): JSX.Element {
  const { onCancel: toggleEdit } = props;
  const methods = useForm<CreateQuoteData>({
    mode: 'onBlur',
  });

  const mutation = useCreateQuoteMutation({
    onSuccess: () => toggleEdit(),
  });

  const onSubmit = (data: CreateQuoteData): void => {
    mutation.mutate({ data });
  };

  return (
    <Form<CreateQuoteData>
      className="flex flex-col border rounded border-gray-300 p-2"
      onSubmit={onSubmit}
      methods={methods}
    >
      <QuoteFormBody />
      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={toggleEdit}>
          Nevermind
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </Form>
  );
}
