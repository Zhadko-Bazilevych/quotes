'use client';

import * as React from 'react';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import type { JSX } from 'react';
import { useFormField } from '@/components/ui/form';
import { FormFieldContext, FormItemContext } from '@/components/ui/form';

const Form = FormProvider;

type CustomFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  render: (
    props: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
  name: TName;
  label: string;
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: CustomFieldProps<TFieldValues, TName>,
): JSX.Element => {
  const { render, name, label } = props;
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller<TFieldValues, TName>
        name={name}
        render={({ field, formState }) => {
          const { errors } = formState;
          const errorMap = errors[name]?.types ?? {};

          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>{render(field)}</FormControl>
              <div className="mb-1 min-h-5 text-sm text-red-500">
                {Object.values(errorMap)
                  .flat()
                  .map((msg, i) => (
                    <p key={i}>{msg}</p>
                  ))}
              </div>
            </FormItem>
          );
        }}
      />
    </FormFieldContext.Provider>
  );
};

function FormItem({
  className,
  ...props
}: React.ComponentProps<'div'>): JSX.Element {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-1', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>): JSX.Element {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({
  ...props
}: React.ComponentProps<typeof Slot>): JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<'p'>): JSX.Element {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  ...props
}: React.ComponentProps<'p'>): JSX.Element | null {
  const { error, formMessageId } = useFormField();
  const body = error ? (error.message ?? '') : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
