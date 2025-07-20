import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type QuoteFormProps = {
  id: number;
  author: string;
  sender: string;
  content: string;
  context: string;
};

export function QuoteForm(props: QuoteFormProps) {
  const { author, content, context, sender } = props;

  return (
    <form className="flex flex-col gap-3 border rounded border-gray-300 p-2">
      <div className="flex justify-between">
        <Input value={author} />
      </div>
      <div className="flex justify-between">
        <Textarea value={content} />
      </div>
      <div>
        <Textarea value={context} />
        <Input value={sender} />
      </div>
    </form>
  );
}
