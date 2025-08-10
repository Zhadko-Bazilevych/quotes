import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import type { CreateQuoteData } from '@/types';
import { useCreateQuoteMutation } from '@/hooks/use-create-quote';
import { Form, FormItem } from '@/components/form';

type CreateQuoteFormProps = {
  onCancel: () => void;
};

export function CreateQuoteForm(props: CreateQuoteFormProps): JSX.Element {
  const { onCancel: toggleEdit } = props;
  const methods = useForm<CreateQuoteData>({
    mode: 'all',
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
      <FormItem<CreateQuoteData>
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
      <FormItem<CreateQuoteData>
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
      <FormItem<CreateQuoteData>
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
      <FormItem<CreateQuoteData>
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
          Nevermind
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </Form>
  );
}
