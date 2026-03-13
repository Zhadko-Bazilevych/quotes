import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type CreateQuoteSchema,
  createQuoteSchema,
} from '@/components/quote/form/create-quote-schema';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
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
import { useCreateQuoteMutation } from '@/hooks/use-create-quote';

export type CreateQuoteFormProps = {
  onCancel: () => void;
};

export function CreateQuoteForm(props: CreateQuoteFormProps): JSX.Element {
  const { onCancel: toggleEdit } = props;
  const { t } = useTranslation();
  const form = useForm<CreateQuoteSchema>({
    defaultValues: {
      author: '',
      content: '',
      context: '',
      visibility: 'public',
    },
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(createQuoteSchema),
  });

  const { control, handleSubmit } = form;

  const mutation = useCreateQuoteMutation({
    onSuccess: () => toggleEdit(),
  });

  const onSubmit = (data: CreateQuoteSchema): void => {
    mutation.mutate({ data });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="bg-card flex flex-col rounded border p-2"
      >
        <FormField
          control={control}
          name="author"
          label="Author"
          render={(props) => <Input {...props} />}
        />
        <FormField
          control={control}
          name="content"
          label="Content"
          render={(props) => <Textarea {...props} />}
        />
        <FormField
          control={control}
          name="context"
          label="Context"
          render={(props) => <Textarea {...props} />}
        />
        <FormField
          control={control}
          name="visibility"
          label={t(($) => $.quote.fields.visibility.label, {
            defaultValue: 'Visibility',
          })}
          render={(field) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-60">
                <SelectValue
                  placeholder={t(
                    ($) => $.quote.form.visibility.selectPlaceholder,
                    {
                      defaultValue: 'Select a visibility option',
                    },
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="public">
                    {t(($) => $.quote.fields.visibility.enum.public, {
                      defaultValue: 'Public',
                    })}
                  </SelectItem>
                  <SelectItem value="private">
                    {t(($) => $.quote.fields.visibility.enum.private, {
                      defaultValue: 'Private',
                    })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
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
