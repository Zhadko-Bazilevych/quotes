export type KeywordSearch = {
  value: string;
  include: boolean;
};

export type ParsedQuery<TKeyword extends string> = {
  [K in TKeyword]: KeywordSearch[];
};

export class QueryParser<TKeyword extends string> {
  constructor(private readonly keywords: TKeyword[]) {}

  parse(q: string): ParsedQuery<TKeyword> {
    q = q.trim();
    const res: ParsedQuery<TKeyword> = this.keywords.reduce(
      (acc, curr) => ({
        [curr]: [],
        ...acc,
      }),
      {} as ParsedQuery<TKeyword>,
    );

    let currentKeyword: TKeyword | null = null;
    let wordStart = 0;
    for (let i = 0; i < q.length; i++) {
      const char = q[i];

      if (char === ' ') {
        const word = q.slice(wordStart, i + 1).trim();
        wordStart = i + 1;
        if (word && currentKeyword) {
          const keywordSearch = this.getKeywordSearch(word);
          if (keywordSearch) {
            res[currentKeyword].push(keywordSearch);
          }
        }
      } else if (char === ':') {
        const word = q.slice(wordStart, i);
        wordStart = i + 1;
        if (this.isKeyword(word)) {
          currentKeyword = word;
        }
      }
    }
    const word = q.slice(wordStart).trim();
    if (word && currentKeyword) {
      const keywordSearch = this.getKeywordSearch(word);
      if (keywordSearch) {
        res[currentKeyword].push(keywordSearch);
      }
    }

    return res;
  }

  private getKeywordSearch(word: string): KeywordSearch | null {
    const include = !word.startsWith('-');
    word = include ? word : word.slice(1);
    if (!word) {
      return null;
    }

    return {
      value: word,
      include,
    };
  }

  private isKeyword(word: string): word is TKeyword {
    return this.keywords.includes(word as TKeyword);
  }
}
