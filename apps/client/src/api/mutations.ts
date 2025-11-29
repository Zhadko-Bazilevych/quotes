import type { MutationFunction } from '@tanstack/react-query';

import { api } from '@/api';
import type { CreateQuoteData, Quote, UpdateQuoteData } from '@/types/quote';

import type { Api } from './api';

export type UpdateQuoteVariables = {
  id: number;
  data: UpdateQuoteData;
};

export type CreateQuoteVariables = {
  data: CreateQuoteData;
};

export type DeleteQuoteVariables = {
  id: number;
};

type MutationDetails<TData = unknown, TVariables = unknown> = {
  mutationFn: MutationFunction<TData, TVariables>;
  mutationKey: unknown[];
};

type Mutations = {
  quotes: {
    update: MutationDetails<Quote, UpdateQuoteVariables>;
    create: MutationDetails<Quote, CreateQuoteVariables>;
    delete: MutationDetails<Quote, DeleteQuoteVariables>;
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
      delete: {
        mutationFn: ({ id }: DeleteQuoteVariables): Promise<Quote> =>
          api.quotes.delete(id),
        mutationKey: ['quotes', 'delete'],
      },
    },
  };
};

export const mutations = createMutations(api);
