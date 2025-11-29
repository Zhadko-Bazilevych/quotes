import React from 'react';
import {
  type FieldValues,
  useFormContext,
  type UseFormGetFieldState,
  useFormState,
} from 'react-hook-form';

import { FormFieldContext, FormItemContext } from '@/components/ui/form';

export const useFormField = (): {
  id: string;
  name: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  value: unknown;
} & ReturnType<UseFormGetFieldState<FieldValues>> => {
  const fieldContext = React.useContext(FormFieldContext);
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, getValues } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const value = getValues(fieldContext.name) as unknown;

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
    value,
  };
};
