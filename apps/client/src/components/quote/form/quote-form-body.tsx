import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JSX } from 'react';
import { FormField } from '@/components/ui/form';
import type { CreateQuoteData, UpdateQuoteData } from '@/types';

type QuoteFormData = CreateQuoteData | UpdateQuoteData;

export function QuoteFormBody(): JSX.Element {
  return (
    <>
      <FormField<QuoteFormData>
        name="author"
        label="Author"
        render={(props) => <Input {...props} />}
      />
      <FormField<QuoteFormData>
        name="content"
        label="Content"
        render={(props) => <Textarea {...props} />}
      />
      <FormField<QuoteFormData>
        name="context"
        label="Context"
        render={(props) => <Textarea {...props} />}
      />
      <FormField<QuoteFormData>
        name="user"
        label="User"
        render={(props) => <Input {...props} />}
      />
    </>
  );
}
