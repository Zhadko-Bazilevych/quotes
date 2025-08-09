import type { Quote, UpdateQuoteData } from '@/types';
import { api } from '@/api';
import type { Api } from './api';
import type { MutationFunction } from '@tanstack/react-query';

export type UpdateQuoteVariables = {
  id: number;
  data: UpdateQuoteData;
};

type MutationDetails<TData = unknown, TVariables = unknown> = {
  mutationFn: MutationFunction<TData, TVariables>;
  mutationKey: unknown[];
};

type Mutations = {
  quotes: {
    update: MutationDetails<Quote, UpdateQuoteVariables>;
  };
};

export const createMutations = (api: Api): Mutations => {
  return {
    quotes: {
      update: {
        mutationFn: ({ id, data }: UpdateQuoteVariables): Promise<Quote> =>
          api.quotes.update(id, data),
        mutationKey: ['quotes', 'update'],
      },
    },
  };
};

export const mutations = createMutations(api);
