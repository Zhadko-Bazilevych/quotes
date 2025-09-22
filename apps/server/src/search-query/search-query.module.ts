import { DynamicModule, Module } from '@nestjs/common';
import { SearchQueryService } from './search-query.service';
import { MakeKeywords } from './search-query.types';

@Module({})
export class SearchQueryModule {
  static register<TKeywordInput extends string>(
    token: symbol,
    keywords:
      | readonly MakeKeywords<TKeywordInput>[]
      | MakeKeywords<TKeywordInput>[],
  ): DynamicModule {
    return {
      module: SearchQueryModule,
      providers: [
        {
          provide: token,
          useFactory: (): SearchQueryService<
            TKeywordInput,
            MakeKeywords<TKeywordInput>
          > => new SearchQueryService(keywords),
        },
      ],
      exports: [token],
    };
  }
}
