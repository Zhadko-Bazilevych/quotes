import { DynamicModule, Module } from '@nestjs/common';
import { SearchQueryService } from './search-query.service';
import { KeywordToken } from 'src/search-query/search-query.types';

@Module({})
export class SearchQueryModule {
  static register<TLiteral extends string>(
    token: symbol,
    keywords: readonly KeywordToken<TLiteral>[] | KeywordToken<TLiteral>[],
  ): DynamicModule {
    return {
      module: SearchQueryModule,
      providers: [
        {
          provide: token,
          useFactory: (): SearchQueryService<
            TLiteral,
            KeywordToken<TLiteral>
          > => new SearchQueryService(keywords),
        },
      ],
      exports: [token],
    };
  }
}
