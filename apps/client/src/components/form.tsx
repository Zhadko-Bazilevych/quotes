import type { JSX } from 'react';
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';

type FormProps<T extends FieldValues> = {
  className: string;
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
};

export function Form<T extends FieldValues>(props: FormProps<T>): JSX.Element {
  const { children, methods, onSubmit, className } = props;
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
}
