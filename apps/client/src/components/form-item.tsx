import {
  useFormContext,
  type FieldError,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from 'react-hook-form';

type FormItemProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  rules: RegisterOptions<T, Path<T>>;
  render: (props: UseFormRegisterReturn<string>) => React.ReactNode;
};

export function FormItem<T extends FieldValues>(
  props: FormItemProps<T>,
): React.ReactNode {
  const { name, label, rules, render } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name] as FieldError | undefined;

  return (
    <div className="flex gap-1">
      <label className="w-20 text-right p-1">{label}: </label>
      {render(register(name, rules))}
      {error?.message ? (
        <span className="text-red-500">{error.message}</span>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  );
}
