import { useId } from 'react';
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from 'react-hook-form';

type FormElementProps<TFieldName extends string> =
  UseFormRegisterReturn<TFieldName> & {
    id: string;
  };

type FormItemProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TFieldName;
  label: string;
  rules: RegisterOptions<TFieldValues, TFieldName>;
  render: (props: FormElementProps<TFieldName>) => React.ReactNode;
};

export function FormItem<T extends FieldValues>(
  props: FormItemProps<T>,
): React.ReactNode {
  const { name, label, rules, render } = props;
  const {
    register,
    formState: { errors: formErrors },
  } = useFormContext<T>();
  const id = useId();
  const uniqueName = `${id}-${name}`;

  let errorList = {};
  if (formErrors[name]?.types) {
    errorList = formErrors[name].types;
  } else if (formErrors[name]?.type) {
    errorList = { message: formErrors[name].message };
  }
  const errors = Object.entries<string>(errorList).map(([type, message]) => ({
    type,
    message,
  }));

  return (
    <div className="flex flex-col">
      <label htmlFor={uniqueName}>{label}: </label>
      {render({ ...register(name, rules), id: uniqueName })}
      {errors.map(({ type, message }) => {
        return (
          <span key={type} className="text-red-500">
            {message}
          </span>
        );
      })}
      {!errors.length && <div className="h-6"></div>}
    </div>
  );
}
