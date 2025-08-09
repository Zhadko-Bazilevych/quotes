import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { Quote, UpdateQuoteData } from '@/types';
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';
import { FormItem } from '@/components/form-item';
import { Form } from '@/components/form';

type QuoteFormProps = {
  quote: Quote;
  onCancel: () => void;
};

export function QuoteForm(props: QuoteFormProps): JSX.Element {
  const { quote, onCancel: toggleEdit } = props;
  const methods = useForm<UpdateQuoteData>({
    values: {
      author: quote.author,
      content: quote.content,
      context: quote.context,
      user: quote.user,
    },
    mode: 'all',
  });

  const mutation = useUpdateQuoteMutation({
    onSuccess: () => toggleEdit(),
  });

  const onSubmit = (data: UpdateQuoteData): void => {
    mutation.mutate({ id: quote.id, data });
  };

  return (
    <Form
      className="flex flex-col border rounded border-gray-300 p-2"
      onSubmit={onSubmit}
      methods={methods}
    >
      <FormItem
        name="author"
        label="Author"
        render={(props) => <Input {...props} />}
        rules={{ required: 'Field is required' }}
      />
      <FormItem
        name="content"
        label="Content"
        render={(props) => <Textarea {...props} />}
        rules={{ required: 'Field is required' }}
      />
      <FormItem
        name="context"
        label="Context"
        render={(props) => <Textarea {...props} />}
        rules={{ required: 'Field is required' }}
      />
      <FormItem
        name="user"
        label="User"
        render={(props) => <Input {...props} />}
        rules={{ required: 'Field is required' }}
      />
      <div className="flex gap-3 items-end">
        <Button type="button" onClick={toggleEdit}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
