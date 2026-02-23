import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { keepPreviousData } from '@tanstack/react-query';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useUserList } from '@/hooks/use-user-list';
import type { UserSearchItem } from '@/types/user';

type SelectUserProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  defaultValue?: UserSearchItem;
};

export function SelectUser<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field, defaultValue }: SelectUserProps<TFieldValues, TName>): JSX.Element {
  const [selectedValue, setSelectedValue] = useState<UserSearchItem | null>(
    defaultValue ?? null,
  );
  const [q, setQ] = useState(defaultValue?.name ?? '');
  const debouncedQ = useDebouncedValue(q, 500);
  const { data } = useUserList(
    { q: debouncedQ, limit: 8 },
    { placeholderData: keepPreviousData },
  );
  const { t } = useTranslation();

  const items = useMemo(() => {
    if (!selectedValue) {
      return data;
    }
    const noSelectedData =
      data?.filter((user) => user.id !== selectedValue.id) ?? [];

    return [selectedValue, ...noSelectedData];
  }, [data, selectedValue]);

  return (
    <Combobox<UserSearchItem>
      items={items}
      itemToStringLabel={(user) => user.name}
      filter={null}
      inputValue={q}
      onInputValueChange={setQ}
      value={selectedValue ?? null}
      onValueChange={(user) => {
        setSelectedValue(user);
        field.onChange(user?.id ?? undefined);
      }}
    >
      <ComboboxInput
        placeholder={t(($) => $.quote.user.select.placeholder, {
          defaultValue: 'Select a user',
        })}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {t(($) => $.quote.user.select.notFound, {
            defaultValue: 'No users found',
          })}
        </ComboboxEmpty>
        <ComboboxList>
          {(item: UserSearchItem) => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
