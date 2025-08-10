import type { CreateQuoteData, Quote, UpdateQuoteData } from '@/types';
import { api } from '@/api';
import type { Api } from './api';
import type { MutationFunction } from '@tanstack/react-query';

export type UpdateQuoteVariables = {
  id: number;
  data: UpdateQuoteData;
};

export type CreateQuoteVariables = {
  data: CreateQuoteData;
};

type MutationDetails<TData = unknown, TVariables = unknown> = {
  mutationFn: MutationFunction<TData, TVariables>;
  mutationKey: unknown[];
};

type Mutations = {
  quotes: {
    update: MutationDetails<Quote, UpdateQuoteVariables>;
    create: MutationDetails<Quote, CreateQuoteVariables>;
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
      create: {
        mutationFn: ({ data }: CreateQuoteVariables): Promise<Quote> =>
          api.quotes.create(data),
        mutationKey: ['quotes', 'create'],
      },
    },
  };
};

export const mutations = createMutations(api);
