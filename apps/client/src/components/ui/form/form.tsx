'use client';

import * as React from 'react';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  type Control,
  type ControllerProps,
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

const BaseFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>,
): JSX.Element => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type CustomFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  render: (
    props: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
  name: TName;
  label: string;
  description?: string;
  control?: Control<TFieldValues, unknown, TFieldValues>;
};

const FormField = <TFieldValues extends FieldValues = FieldValues>(
  props: CustomFieldProps<TFieldValues>,
): JSX.Element => {
  const { render, name, label, description, control } = props;
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel className="mb-1">{label}</FormLabel>
              <FormControl>{render(field)}</FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </FormFieldContext.Provider>
  );
};

function FormItem(props: React.ComponentProps<'div'>): JSX.Element {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" {...props} />
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

function FormControl(props: React.ComponentProps<typeof Slot>): JSX.Element {
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
}: React.ComponentProps<'div'>): JSX.Element | null {
  const { error, formMessageId, value } = useFormField();
  const errorMap = error?.types ?? {};
  let errorMessages = Object.values(errorMap).flat();
  if (value === '' && errorMap.too_small) {
    errorMessages = [errorMap.too_small].flat();
  }
  return (
    <>
      <div
        className={cn('text-destructive min-h-5 text-sm', className)}
        id={formMessageId}
        data-slot="form-message"
        {...props}
      >
        {errorMessages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </>
  );
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  BaseFormField,
  FormField,
};
