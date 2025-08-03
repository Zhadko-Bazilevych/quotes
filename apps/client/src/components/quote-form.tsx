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
    mode: "all",
  });
  const onSubmit = (data: QuoteFormState) => {
    alert(JSON.stringify(data));
    toggleEdit();
  };

  return (
    <form
      className="flex flex-col border rounded border-gray-300 p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex">
        <div className="w-20 text-right p-1">Author: </div>
        <div className="flex flex-col">
          <Input {...register("author", { required: "Field is required" })} />
          {errors.author ? (
            <span className="text-red-500">{errors.author.message}</span>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-20 text-right p-1">Content: </div>
        <div className="flex flex-col w-1/2">
          <Textarea
            {...register("content", { required: "Field is required" })}
          />
          {errors.content ? (
            <span className="text-red-500">{errors.content.message}</span>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="w-20 text-right p-1">Context: </div>
        <div className="flex flex-col w-1/2">
          <Textarea
            className="flex-1"
            {...register("context", { required: "Field is required" })}
          />
          {errors.context ? (
            <span className="text-red-500">{errors.context.message}</span>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <div className="w-20 text-right p-1">Sender:</div>
          <div className="flex flex-col">
            <Input {...register("sender", { required: "Field is required" })} />
            {errors.sender ? (
              <span className="text-red-500">{errors.sender.message}</span>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-end">
          <Button type="button" onClick={toggleEdit}>
            Cancel
          </Button>
          <Button disabled={!isValid} type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
