import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateQuoteData, UpdateQuoteData } from '@/types';
import type { JSX } from 'react';

type QuoteFormData = CreateQuoteData | UpdateQuoteData;

export function QuoteFormBody(): JSX.Element {
  return (
    <>
      <FormItem<QuoteFormData>
        name="author"
        label="Author"
        render={(props) => <Input {...props} />}
      />
      <FormItem<QuoteFormData>
        name="content"
        label="Content"
        render={(props) => <Textarea {...props} />}
      />
      <FormItem<QuoteFormData>
        name="context"
        label="Context"
        render={(props) => <Textarea {...props} />}
      />
      <FormItem<QuoteFormData>
        name="user"
        label="User"
        render={(props) => <Input {...props} />}
      />
    </>
  );
}
