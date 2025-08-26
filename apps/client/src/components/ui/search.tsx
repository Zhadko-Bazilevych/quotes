import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import type { JSX } from "react";

type SearchProps = {
  value: string;
  setValue: (value: string) => void;
} & React.ComponentProps<'input'>;

export function Search(props: SearchProps): JSX.Element {
  const {value, setValue, ...rest } = props;

  let inputData: string;

  return (
    <div className="flex w-full items-center gap-2">
      <Input onChange={(e) => { inputData=e.target.value }} {...rest}/>
      <Button onClick={() => { setValue(inputData) }} variant="outline" size="icon">
        <SearchIcon/>
      </Button>
      </div>
  )
}