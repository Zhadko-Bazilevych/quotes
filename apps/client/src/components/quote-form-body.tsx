import { FormItem } from '@/components/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateQuoteData, UpdateQuoteData } from '@/types';

type QuoteFormData = CreateQuoteData | UpdateQuoteData;

export function QuoteFormBody() {
  return (
    <>
      <FormItem<QuoteFormData>
        name="author"
        label="Author"
        render={(props) => <Input {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 30,
            message: 'Author name is too long. Maximum characters <= 30',
          },
          minLength: {
            value: 3,
            message: 'Author name is too short. Minimum characters >= 3',
          },
        }}
      />
      <FormItem<QuoteFormData>
        name="content"
        label="Content"
        render={(props) => <Textarea {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 500,
            message: 'Content is too long. Maximum characters <= 500',
          },
          minLength: {
            value: 3,
            message: 'Content name is too short. Minimum characters >= 3',
          },
        }}
      />
      <FormItem<QuoteFormData>
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
      <FormItem<QuoteFormData>
        name="user"
        label="User"
        render={(props) => <Input {...props} />}
        rules={{
          required: 'Field is required',
          maxLength: {
            value: 30,
            message: 'User name is too long. Maximum characters <= 30',
          },
          minLength: {
            value: 3,
            message: 'User name is too short. Minimum characters >= 3',
          },
        }}
      />
    </>
  );
}
