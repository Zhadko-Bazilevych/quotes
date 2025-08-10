import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { Quote, UpdateQuoteData } from '@/types';
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';
import { Form, FormItem } from '@/components/form';

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
      <FormItem<UpdateQuoteData>
        name="author"
        label="Author"
        render={(props) => <Input {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 30,
            message: 'Author name is too long. Maximum characters <= 30',
          },
        }}
      />
      <FormItem<UpdateQuoteData>
        name="content"
        label="Content"
        render={(props) => <Textarea {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 500,
            message: 'Content is too long. Maximum characters <= 500',
          },
        }}
      />
      <FormItem<UpdateQuoteData>
        name="context"
        label="Context"
        render={(props) => <Textarea {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 500,
            message: 'Context is too long. Maximum characters <= 500',
          },
        }}
      />
      <FormItem<UpdateQuoteData>
        name="user"
        label="User"
        render={(props) => <Input {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 30,
            message: 'User name is too long. Maximum characters <= 30',
          },
        }}
      />
      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={toggleEdit}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
}
