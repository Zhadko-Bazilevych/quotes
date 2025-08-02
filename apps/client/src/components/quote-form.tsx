import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";

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
  const { author, content, context, sender, onEdit: toggleEdit } = props;
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = useForm<QuoteFormState>({
    values: { author, content, context, sender },
  });
  const onSubmit = (data: QuoteFormState) => {
    alert(JSON.stringify(data));
    toggleEdit();
  };

  return (
    <form
      className="flex flex-col gap-3 border rounded border-gray-300 p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between">
        <Input {...register("author", { required: true })} />
      </div>
      <div className="flex justify-between">
        <Textarea {...register("content", { required: true })} />
      </div>
      <div>
        <Textarea {...register("context", { required: true })} />
        <div className="flex justify-between">
          <Input {...register("sender", { required: true })} />
          <div className="flex gap-2">
            <Button type="button" onClick={toggleEdit}>
              Cancel
            </Button>
            <Button disabled={!isValid} type="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
