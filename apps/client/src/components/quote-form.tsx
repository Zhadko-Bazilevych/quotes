import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import type { JSX } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Quote, UpdateQuoteData } from '@/types';
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';

type QuoteFormProps = {
  quote: Quote;
  onCancel: () => void;
};

export function QuoteForm(props: QuoteFormProps): JSX.Element {
  const { quote, onCancel: toggleEdit } = props;
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = useForm<UpdateQuoteData>({
    values: {
      author: quote.author,
      content: quote.content,
      context: quote.context,
      user: quote.user,
    },
    mode: 'all',
  });

  const queryClient = useQueryClient();
  const mutation = useUpdateQuoteMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quotes', 'list'] });
      toggleEdit();
    },
  });

  const onSubmit = (data: UpdateQuoteData): void => {
    mutation.mutate({ id: quote.id, data });
  };

  return (
    <form
      className="flex flex-col border rounded border-gray-300 p-2"
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
    >
      <div className="flex">
        <div className="w-20 text-right p-1">Author: </div>
        <div className="flex flex-col">
          <Input {...register('author', { required: 'Field is required' })} />
          {errors.author ? (
            <span className="text-red-500">{errors.author.message}</span>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-20 text-right p-1">Content: </div>
        <div className="flex flex-col w-1/2">
          <Textarea
            {...register('content', { required: 'Field is required' })}
          />
          {errors.content ? (
            <span className="text-red-500">{errors.content.message}</span>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-20 text-right p-1">Context: </div>
        <div className="flex flex-col w-1/2">
          <Textarea
            className="flex-1"
            {...register('context', { required: 'Field is required' })}
          />
          {errors.context ? (
            <span className="text-red-500">{errors.context.message}</span>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <div className="w-20 text-right p-1">Sender:</div>
          <div className="flex flex-col">
            <Input {...register('user', { required: 'Field is required' })} />
            {errors.user ? (
              <span className="text-red-500">{errors.user.message}</span>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-end">
          <Button type="button" onClick={toggleEdit}>
            Cancel
          </Button>
          <Button disabled={!isValid} type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
