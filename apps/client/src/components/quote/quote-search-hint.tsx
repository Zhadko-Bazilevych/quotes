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
import type { JSX } from 'react';

export function QuoteSearchHint(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="">
          <CircleQuestionMarkIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
              <InlineCode>author:</InlineCode> quote author
            </li>
            <li>
              <InlineCode>user:</InlineCode> person published the quote
            </li>
            <li>
              <InlineCode>content:</InlineCode> text of the quote
            </li>
            <li>
              <InlineCode>context:</InlineCode> description or explanation
            </li>
          </ul>
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

          <h3 className="mt-4 text-lg font-semibold">
            Global search across all fields
          </h3>
          <p>
            Words without a keyword are searched in every field:{' '}
            <InlineCode>author</InlineCode>, <InlineCode>user</InlineCode>,{' '}
            <InlineCode>content</InlineCode>, and{' '}
            <InlineCode>context</InlineCode>.
          </p>
          <p>
            Example: <InlineCode>hope</InlineCode> finds quotes where{' '}
            <InlineCode>hope</InlineCode> appears in any field.
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
