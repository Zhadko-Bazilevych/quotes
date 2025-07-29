import { useState } from "react";

type BaseRecord = Record<string, unknown>;

type UseFormParams<T extends BaseRecord> = {
  initialValues?: Partial<T>;
};

type OnChangeEvent = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

type RegisterFunc<T extends BaseRecord> = (field: keyof T) => {
  name: keyof T;
  value: Partial<T>[keyof T];
  onChange: OnChangeEvent;
};

export function useForm<T extends BaseRecord>(params?: UseFormParams<T>) {
  const { initialValues = {} as Partial<T> } =
    params ?? ({} as UseFormParams<T>);
  const [formValues, setFormState] = useState<Partial<T>>(initialValues);
  const register: RegisterFunc<T> = (field: keyof T) => {
    return {
      name: field,
      value: formValues[field],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setFormState((prev) => {
          return {
            ...prev,
            [field]: e.target.value,
          };
        });
      },
    };
  };

  return {
    formValues,
    register,
  };
}
