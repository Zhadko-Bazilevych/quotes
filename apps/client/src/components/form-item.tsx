import { useId } from 'react';
import {
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from 'react-hook-form';

type FormElementProps = UseFormRegisterReturn<string> & {
  id: string;
};

type FormItemProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  rules: RegisterOptions<T, Path<T>>;
  render: (props: FormElementProps) => React.ReactNode;
};

export function FormItem<T extends FieldValues>(
  props: FormItemProps<T>,
): React.ReactNode {
  const { name, label, rules, render } = props;
  const id = useId();
  const uniqueName = `${id}-${name}`;

  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const errorList = (
    Object.entries(errors[name]?.types ?? {}) as [string, string][]
  ).map(([type, message]) => ({ type, message }));
  return (
    <div className="flex flex-col">
      <label htmlFor={uniqueName}>{label}: </label>
      {render({ ...register(name, rules), id: uniqueName })}
      {errorList.map(({ type, message }) => {
        return (
          <span key={type} className="text-red-500">
            {message}
          </span>
        );
      })}
      {!errorList.length && <div className="h-6"></div>}
    </div>
  );
}
