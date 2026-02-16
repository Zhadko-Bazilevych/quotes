import type { JSX } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';

import { SelectUser } from '@/components/quote/form/select-user';
import { updateQuoteSchema } from '@/components/quote/form/update-quote-schema';
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
import { useUpdateQuoteMutation } from '@/hooks/use-update-quote';
import { Can } from '@/lib/casl/permissions';
import type { Quote, UpdateQuoteData } from '@/types/quote';
import { getDirtyValues } from '@/utils/get-dirty-values';

type UpdateQuoteFormProps = {
  quote: Quote;
  onCancel: (id: number) => void;
};

export const UpdateQuoteForm = React.memo(function UpdateQuoteForm(
  props: UpdateQuoteFormProps,
): JSX.Element {
  const { quote, onCancel } = props;
  const { t } = useTranslation();
  const form = useForm<UpdateQuoteData>({
    defaultValues: {
      author: quote.author,
      content: quote.content,
      context: quote.context,
      userId: quote.user.id,
      visibility: quote.visibility,
    },
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(updateQuoteSchema),
  });

  const {
    formState: { dirtyFields },
    control,
    handleSubmit,
  } = form;

  const mutation = useUpdateQuoteMutation({
    onSuccess: () => onCancel(quote.id),
  });

  const onSubmit = (data: UpdateQuoteData): void => {
    const dirtyValues = getDirtyValues(data, dirtyFields);
    mutation.mutate({ id: quote.id, data: dirtyValues });
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
        <Can I="update" this={quote} field="userId">
          <FormField
            control={control}
            name="userId"
            label={t(($) => $.quote.user.label, {
              defaultValue: 'Uploaded by',
            })}
            render={(field) => (
              <SelectUser
                field={field}
                defaultValue={{ id: quote.userId, name: quote.user.name }}
              />
            )}
          />
        </Can>

        <FormField
          control={control}
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
                      defaultValue: 'Public',
                    })}
                  </SelectItem>
                  <SelectItem value="private">
                    {t(($) => $.quote.visibility.private, {
                      defaultValue: 'Private',
                    })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => onCancel(quote.id)}
            variant="destructive"
          >
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  );
});
