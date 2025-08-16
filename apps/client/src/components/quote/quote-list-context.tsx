import { createContext, useContext } from 'react';

export type QuoteListContext = {
  setIsQuoteListVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const QuoteListContext = createContext<QuoteListContext | null>(null);

export function useQuoteListContext(): QuoteListContext {
  const quoteListIsVisibleContext = useContext(QuoteListContext);

  if (!quoteListIsVisibleContext) {
    throw new Error(
      "QuoteListContext should only be used inside of it's provider",
    );
  }

  return quoteListIsVisibleContext;
}
