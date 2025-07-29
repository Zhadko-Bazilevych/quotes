import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "./hooks/use-form";

type QuoteFormProps = {
  id: number;
  author: string;
  sender: string;
  content: string;
  context: string;
  onEdit: () => void;
};

type QuoteFormState = {
  author: string;
  sender: string;
  content: string;
  context: string;
};

export function QuoteForm(props: QuoteFormProps) {
  const { author, content, context, sender } = props;
  const { formValues: quote, register } = useForm<QuoteFormState>({
    initialValues: { author, content, context, sender },
  });
  
  return (
    <form className="flex flex-col gap-3 border rounded border-gray-300 p-2">
      <div className="flex justify-between">
        <Input {...register("author")} />
      </div>
      <div className="flex justify-between">
        <Textarea {...register("content")} />
      </div>
      <div>
        <Textarea {...register("context")} />
        <Input {...register("sender")} />
      </div>
    </form>
  );
}
