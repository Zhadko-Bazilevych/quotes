import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CreateQuoteData, UpdateQuoteData } from '@/types/quote';

type QuoteFormData = CreateQuoteData | UpdateQuoteData;

export function QuoteFormBody(): JSX.Element {
  const { t } = useTranslation();

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
      <FormField<QuoteFormData>
        name="visibility"
        label={t(($) => $.quote.visibility.label, {
          defaultValue: 'Visibility',
        })}
        render={(field) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="public">
                  {t(($) => $.quote.visibility.public, {
                    defaultValue: 'public',
                  })}
                </SelectItem>
                <SelectItem value="private">
                  {t(($) => $.quote.visibility.private, {
                    defaultValue: 'private',
                  })}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </>
  );
}
