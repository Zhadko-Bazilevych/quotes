import {
  EllipsisVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from 'lucide-react';
import React, { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAbility } from '@casl/react';

import { DeleteModal } from '@/components/quote/delete-quote-modal';
import { Button } from '@/components/ui/button';
import { AuthRequiredButton } from '@/components/ui/button/auth-required-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteQuoteMutation } from '@/hooks/use-delete-quote';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useVoteQuoteMutation } from '@/hooks/use-vote-quote';
import { AbilityContext, Can } from '@/lib/casl/permissions';
import type { Quote } from '@/types/quote';
import { formatDatetime } from '@/utils/formatters';

export type QuoteCardProps = {
  quote: Quote;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const QuoteCard = React.memo(function QuoteCard(
  props: QuoteCardProps,
): JSX.Element {
  const { quote, onEdit, onDelete } = props;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { isPending, mutate } = useDeleteQuoteMutation();
  const { isPending: isVoting, mutate: mutateVote } = useVoteQuoteMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();
  const ability = useAbility(AbilityContext);

  const toggleDetails = (): void => setIsDetailsOpen((prev) => !prev);

  const deleteQuote = (): void => {
    mutate(
      { id: quote.id },
      {
        onSuccess() {
          onDelete(quote.id);
          onClose();
        },
      },
    );
  };

  const toggleEdit = (): void => onEdit(quote.id);

  return (
    <div className="bg-card flex flex-col gap-3 rounded border p-2">
      <div className="flex justify-between">
        <span className="truncate">{quote.author}</span>
        <div className="flex items-center gap-1">
          <span className="hidden sm:block">
            Created: {formatDatetime(quote.createdAt)}
          </span>
          {(ability.can('delete', quote) || ability.can('update', quote)) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <Can I="update" this={quote}>
                  <DropdownMenuItem onClick={toggleEdit}>
                    <span>Edit</span>
                  </DropdownMenuItem>
                </Can>
                <Can I="delete" this={quote}>
                  <DropdownMenuItem asChild>
                    <DeleteModal
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      onOk={deleteQuote}
                      isDeleting={isPending}
                    />
                  </DropdownMenuItem>
                </Can>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <p className="wrap-break-word whitespace-pre-wrap">{quote.content}</p>
      <div className="flex justify-between">
        <Button
          className="self-start"
          onClick={toggleDetails}
          variant="outline"
          size="sm"
        >
          Details
        </Button>
        <div className="flex gap-1">
          <AuthRequiredButton
            onClick={() => {
              mutateVote({ id: quote.id, value: 1 });
            }}
            variant={quote.vote === 1 ? 'default' : 'secondary'}
            size="sm"
            disabled={isVoting}
            className="font-mono"
          >
            <ThumbsUpIcon /> {quote.likes}
          </AuthRequiredButton>
          <AuthRequiredButton
            onClick={() => {
              mutateVote({ id: quote.id, value: -1 });
            }}
            variant={quote.vote === -1 ? 'default' : 'secondary'}
            size="sm"
            disabled={isVoting}
            className="font-mono"
          >
            <ThumbsDownIcon /> {quote.dislikes}
          </AuthRequiredButton>
        </div>
      </div>
      {isDetailsOpen && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="wrap-break-word whitespace-pre-wrap">
              {quote.context}
            </p>
            <span>
              {t(($) => $.quote.fields.user.label, {
                defaultValue: 'Uploaded by: {{username}}',
                username: quote.user.name,
              })}
            </span>
          </div>
          <div>
            <span className="block sm:hidden">
              Created: {formatDatetime(quote.createdAt)}
            </span>
            <span>Updated: {formatDatetime(quote.updatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
});
