import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InlineCode } from '@/components/ui/inline-code';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useState, type JSX } from 'react';

export function QuoteSearchHint(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleQuestionMarkIcon />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl">Quote search hints</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80dvh] overflow-auto text-sm leading-6.5">
          <h3 className="text-lg font-semibold">Search multiple terms</h3>
          <p>
            Enter multiple words, and only quotes that include all of them will
            be shown.
          </p>
          <p>
            Example: <InlineCode>love wisdom</InlineCode> finds quotes with both{' '}
            <InlineCode>love</InlineCode> and <InlineCode>wisdom</InlineCode>.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Exclude terms</h3>
          <p>
            Prefix a word with <InlineCode>-</InlineCode> to exclude it from
            results.
          </p>
          <p>
            Example: <InlineCode>life -death</InlineCode> finds quotes with{' '}
            <InlineCode>life</InlineCode> but not <InlineCode>death</InlineCode>
            .
          </p>

          <h3 className="mt-4 text-lg font-semibold">Exact phrases</h3>
          <p>Wrap words in double quotes to match the exact phrase.</p>
          <p>
            Example: <InlineCode>&quot;to be or not to be&quot;</InlineCode>{' '}
            matches quotes containing this exact phrase.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Search specific fields</h3>
          <p>
            Target a field with <InlineCode>keyword:value</InlineCode> such as:
          </p>
          <ul className="ml-6 list-disc">
            <li>
              <InlineCode>author:</InlineCode> / <InlineCode>a:</InlineCode>{' '}
              quote author{' '}
            </li>
            <li>
              <InlineCode>user:</InlineCode> / <InlineCode>u:</InlineCode>{' '}
              person published the quote{' '}
            </li>
            <li>
              <InlineCode>content:</InlineCode> / <InlineCode>ctn:</InlineCode>{' '}
              / <InlineCode>cn:</InlineCode> text of the quote{' '}
            </li>
            <li>
              <InlineCode>context:</InlineCode> / <InlineCode>ctx:</InlineCode>{' '}
              / <InlineCode>cx:</InlineCode> description or explanation{' '}
            </li>
            <li>
              <InlineCode>common:</InlineCode> / <InlineCode>c:</InlineCode> /{' '}
              <InlineCode>global:</InlineCode> / <InlineCode>g:</InlineCode>{' '}
              search across all fields at once
            </li>
          </ul>
          <p>
            Words without a keyword are marked as{' '}
            <InlineCode>common:</InlineCode> by default{' '}
          </p>
          <p>
            Example: <InlineCode>author:Shakespeare content:love</InlineCode>{' '}
            quotes authored by Shakespeare that mention{' '}
            <InlineCode>love</InlineCode>.
          </p>

          <h3 className="mt-4 text-lg font-semibold">
            Multiple values for one field
          </h3>
          <p>
            Providing several values for the same field matches any of them.
          </p>
          <p>
            Example: <InlineCode>user:John Mark</InlineCode> finds quotes
            published by either <InlineCode>John</InlineCode> or{' '}
            <InlineCode>Mark</InlineCode>.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Combine features</h3>
          <p>
            Mix keywords, multiple values, exclusions, and exact phrases in one
            query.
          </p>
          <p>
            Example:{' '}
            <InlineCode>
              author:&quot;Albert Einstein&quot; content:relativity
              context:-joke
            </InlineCode>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
