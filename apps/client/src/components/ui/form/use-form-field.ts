import { FormFieldContext, FormItemContext } from '@/components/ui/form';
import React from 'react';
import {
  useFormContext,
  useFormState,
  type FieldValues,
  type UseFormGetFieldState,
} from 'react-hook-form';

export const useFormField = (): {
  id: string;
  name: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
} & ReturnType<UseFormGetFieldState<FieldValues>> => {
  const fieldContext = React.useContext(FormFieldContext);
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
