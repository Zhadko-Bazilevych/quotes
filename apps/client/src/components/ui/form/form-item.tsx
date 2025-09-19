import { useId } from 'react';
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
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
  render: (props: FormElementProps<TFieldName>) => React.ReactNode;
};

export function FormItem<T extends FieldValues>(
  props: FormItemProps<T>,
): React.ReactNode {
  const { name, label, render } = props;
  const {
    register,
    formState: { errors: formErrors },
  } = useFormContext<T>();
  const id = useId();
  const uniqueName = `${id}-${name}`;
  const errorMap = formErrors[name]?.types ?? {};

  return (
    <div className="flex flex-col">
      <label htmlFor={uniqueName}>{label}: </label>
      {render({ ...register(name), id: uniqueName })}
      <div className="min-h-6 text-red-500">
        {Object.values(errorMap)
          .flat()
          .map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
      </div>
    </div>
  );
}
