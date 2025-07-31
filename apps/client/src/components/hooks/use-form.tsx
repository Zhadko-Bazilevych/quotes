import { useMemo, useState } from "react";

type BaseRecord = Record<string, string | undefined>;

type UseFormParams<T extends BaseRecord> = {
  initialValues?: Partial<T>;
};

type OnChangeEvent = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

type RegisterFunc<T extends BaseRecord> = (
  field: Extract<keyof T, string>,
  validationOptions?: ValidationOptions
) => {
  name: keyof T;
  onChange: OnChangeEvent;
};

type HandleSubmitFunc<T> = (
  cb: (data: Partial<T>) => Promise<void> | void,
  e: React.FormEvent<HTMLFormElement>
) => Promise<void>;

type ValidationOptions = {
  required: boolean | string;
};

type UseFormState<T extends BaseRecord> = {
  [K in keyof T]: {
    isValid: boolean;
    errors: string[];
  };
};

type fieldValidationState = {
  isValid: boolean;
  messages: string[];
};

function validateField(
  field: string,
  validationOptions?: ValidationOptions
): fieldValidationState {
  if (!validationOptions) {
    return {
      isValid: true,
      messages: [],
    };
  }

  let isValid = true;
  const messages: string[] = [];
  if (validationOptions.required && !field) {
    isValid = false;
    messages.push(
      typeof validationOptions.required === "string"
        ? validationOptions.required
        : "The field is required"
    );
  }
  return {
    isValid,
    messages,
  };
}

export function useForm<T extends BaseRecord>(params?: UseFormParams<T>) {
  const { initialValues = {} as Partial<T> } =
    params ?? ({} as UseFormParams<T>);
  const [formValues, setFormValues] = useState<Partial<T>>(initialValues);
  const [formState, setFormState] = useState<Partial<UseFormState<T>>>({});
  const isValid = useMemo(() => {
    let isValid = true;
    for (const key in formState) {
      isValid = isValid && formState[key]!.isValid;
    }
    return isValid;
  }, [formState]);

  const register: RegisterFunc<T> = (field, validationOptions) => {
    if (!(field in formState)) {
      const validaionState = validateField(
        formValues[field] ?? "",
        validationOptions
      );
      setFormState((prev) => {
        return {
          ...prev,
          [field]: validaionState,
        };
      });
    }
    return {
      name: field,
      value: formValues[field],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const value = e.target.value;
        const state = validateField(value, validationOptions);

        setFormState((prev) => {
          return {
            ...prev,
            [field]: state,
          };
        });
        setFormValues((prev) => {
          return {
            ...prev,
            [field]: value,
          };
        });
      },
    };
  };

  const handleSubmit: HandleSubmitFunc<T> = async (cb, e) => {
    e.preventDefault();
    if (isValid) {
      await cb(formValues);
    }
  };

  return {
    register,
    handleSubmit,
    formState,
    isValid,
  };
}
