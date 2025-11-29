import { DynamicModule, Module } from '@nestjs/common';

import { SearchQueryService } from './search-query.service';

@Module({})
export class SearchQueryModule {
  static register<TAlias extends string>(
    token: symbol,
    keywords: Record<string, TAlias>,
  ): DynamicModule {
    return {
      module: SearchQueryModule,
      providers: [
        {
          provide: token,
          useFactory: (): SearchQueryService<TAlias> =>
            new SearchQueryService(keywords),
        },
      ],
      exports: [token],
    };
  }
}
