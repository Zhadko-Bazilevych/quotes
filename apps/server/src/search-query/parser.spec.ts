import { Lexer } from 'src/search-query/lexer';
import { Parser } from 'src/search-query/parser';
import type { KeywordToken } from './search-query.types';

function getParser<
  TKeywordLiteral extends string,
  TKeyword extends KeywordToken<TKeywordLiteral>,
>(input: string, keywords: TKeyword[] = []): Parser<TKeywordLiteral, TKeyword> {
  const lexer = new Lexer<TKeywordLiteral, TKeyword>(input, keywords);
  return new Parser(lexer);
}

describe('Parser.parse', () => {
  it('always returns a `common` field', () => {
    const parser = getParser('');
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
    });
  });

  it('returns a key for each passed keyword', () => {
    const parser = getParser('', ['kw1', 'kw2', 'kw3']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      kw1: { include: [], exclude: [] },
      kw2: { include: [], exclude: [] },
      kw3: { include: [], exclude: [] },
    });
  });

  it('parses single word into a `common` field with no keywords', () => {
    const parser = getParser('abc');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc', isStrict: false }], exclude: [] },
    });
  });

  it('parses single word into `common` field and adds keywords', () => {
    const parser = getParser('abc', ['kw1', 'kw2']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc', isStrict: false }], exclude: [] },
      kw1: { include: [], exclude: [] },
      kw2: { include: [], exclude: [] },
    });
  });

  it('removes spaces', () => {
    const parser = getParser('     ', ['user']);
    expect(parser.parse()).toStrictEqual({
      user: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
    });
  });

  it('parses multiple words separated by spaces into `common`', () => {
    const parser = getParser(' abc def   ghi ');
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: 'abc', isStrict: false },
          { value: 'def', isStrict: false },
          { value: 'ghi', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('parses a single keyworded token', () => {
    const parser = getParser('user:abc', ['user', 'content']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: { include: [], exclude: [] },
      user: { include: [{ value: 'abc', isStrict: false }], exclude: [] },
    });
  });

  it("skips keywords with colons that don't have values", () => {
    const parser = getParser('kw1: kw2:', ['kw1', 'kw2']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      kw1: { include: [], exclude: [] },
      kw2: { include: [], exclude: [] },
    });
  });

  it('parses a single keyword without a colon into `common`', () => {
    const parser = getParser('user', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'user', isStrict: false }], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('parses colons into `common`', () => {
    const parser = getParser(': :: :::', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: ':', isStrict: false },
          { value: '::', isStrict: false },
          { value: ':::', isStrict: false },
        ],
        exclude: [],
      },
      user: { include: [], exclude: [] },
    });
  });

  it('parses colons after keywords into keywords', () => {
    const parser = getParser('user:: content::: author:: :: :::', [
      'user',
      'author',
      'content',
    ]);
    expect(parser.parse()).toStrictEqual({
      author: {
        include: [
          { value: ':', isStrict: false },
          { value: '::', isStrict: false },
          { value: ':::', isStrict: false },
        ],
        exclude: [],
      },
      common: { include: [], exclude: [] },
      content: { include: [{ value: '::', isStrict: false }], exclude: [] },
      user: { include: [{ value: ':', isStrict: false }], exclude: [] },
    });
  });

  it('parses multiple keywords', () => {
    const parser = getParser('user:testA content:testB author:testC', [
      'user',
      'content',
      'author',
    ]);
    expect(parser.parse()).toStrictEqual({
      author: { include: [{ value: 'testC', isStrict: false }], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: [{ value: 'testB', isStrict: false }], exclude: [] },
      user: { include: [{ value: 'testA', isStrict: false }], exclude: [] },
    });
  });

  it('parses multiple keywords of same type into one keyword', () => {
    const parser = getParser(
      'author:testA content:testB user:testC user:testD content:testE author:testF',
      ['user', 'content', 'author'],
    );
    expect(parser.parse()).toStrictEqual({
      author: {
        include: [
          { value: 'testA', isStrict: false },
          { value: 'testF', isStrict: false },
        ],
        exclude: [],
      },
      common: { include: [], exclude: [] },
      content: {
        include: [
          { value: 'testB', isStrict: false },
          { value: 'testE', isStrict: false },
        ],
        exclude: [],
      },
      user: {
        include: [
          { value: 'testC', isStrict: false },
          { value: 'testD', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('parses multiple values after a keyword', () => {
    const parser = getParser(
      'testA testB user:testA content:testB testC author:testD testE testF',
      ['user', 'content', 'author'],
    );
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: 'testA', isStrict: false },
          { value: 'testB', isStrict: false },
        ],
        exclude: [],
      },
      user: { include: [{ value: 'testA', isStrict: false }], exclude: [] },
      content: {
        include: [
          { value: 'testB', isStrict: false },
          { value: 'testC', isStrict: false },
        ],
        exclude: [],
      },
      author: {
        include: [
          { value: 'testD', isStrict: false },
          { value: 'testE', isStrict: false },
          { value: 'testF', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('removes spaces between keyword and value', () => {
    const parser = getParser(' user:testA  content:  testB author   :testC  ', [
      'user',
      'content',
      'author',
    ]);
    expect(parser.parse()).toStrictEqual({
      author: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
      content: {
        include: [
          { value: 'testB', isStrict: false },
          { value: 'author', isStrict: false },
          { value: ':testC', isStrict: false },
        ],
        exclude: [],
      },
      user: { include: [{ value: 'testA', isStrict: false }], exclude: [] },
    });
  });

  it('handles keywords that are used as values', () => {
    const parser = getParser(
      'user:author content:content content:user common:common',
      ['content', 'author', 'user'],
    );
    expect(parser.parse()).toStrictEqual({
      author: { include: [], exclude: [] },
      common: { include: [{ value: 'common', isStrict: false }], exclude: [] },
      content: {
        include: [
          { value: 'content', isStrict: false },
          { value: 'user', isStrict: false },
        ],
        exclude: [],
      },
      user: { include: [{ value: 'author', isStrict: false }], exclude: [] },
    });
  });

  it('parses into the last keyword when there are multiple keywords followed by a colon', () => {
    const parser = getParser('user:content: testA', ['user', 'content']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: { include: [{ value: 'testA', isStrict: false }], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('skips keywords when they a followed by a colon without a value', () => {
    const parser = getParser('user:user:', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('always parses a `common` keyword', () => {
    const parser = getParser('common:testA');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'testA', isStrict: false }], exclude: [] },
    });
  });

  it('parses `common` keyword that is used as value', () => {
    const parser = getParser('common');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'common', isStrict: false }], exclude: [] },
    });
  });

  it('skips a single `-`', () => {
    const parser = getParser('-');
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
    });
  });

  it('excludes `common` token', () => {
    const parser = getParser('-abc', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [{ value: 'abc', isStrict: false }] },
      user: { include: [], exclude: [] },
    });
  });

  it('excludes a keyword as a value', () => {
    const parser = getParser('-user', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [{ value: 'user', isStrict: false }] },
      user: { include: [], exclude: [] },
    });
  });

  it('excludes a keyword with a colon as value', () => {
    const parser = getParser('-user:', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [{ value: 'user:', isStrict: false }] },
      user: { include: [], exclude: [] },
    });
  });

  it('excludes keyword with a value that is prefixed with a `-`', () => {
    const parser = getParser('-user:testA', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [],
        exclude: [{ value: 'user:testA', isStrict: false }],
      },
      user: { include: [], exclude: [] },
    });
  });

  it('skips a single `-` as value', () => {
    const parser = getParser('user: - ', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('exclude multiple keyworded tokens', () => {
    const parser = getParser('user:-testA content:-testB', ['user', 'content']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: { include: [], exclude: [{ value: 'testB', isStrict: false }] },
      user: { include: [], exclude: [{ value: 'testA', isStrict: false }] },
    });
  });

  it('excludes only values prefixed with `-`', () => {
    const parser = getParser('user:testA -testB content:-testC testD ', [
      'user',
      'content',
    ]);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: {
        include: [{ value: 'testD', isStrict: false }],
        exclude: [{ value: 'testC', isStrict: false }],
      },
      user: {
        include: [{ value: 'testA', isStrict: false }],
        exclude: [{ value: 'testB', isStrict: false }],
      },
    });
  });

  it('skips `-` surrounded by whitespaces', () => {
    const parser = getParser('  -  abc -  user:testA   testB', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc', isStrict: false }], exclude: [] },
      user: {
        include: [
          { value: 'testA', isStrict: false },
          { value: 'testB', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('excludes all `-` after the first `-`', () => {
    const parser = getParser('--- ----', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: ['--', '---'] },
      user: { include: [], exclude: [] },
    });
  });

  it('excludes all `-` after the first `-` together with a value', () => {
    const parser = getParser('user:--testA', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [{ value: '-testA', isStrict: false }] },
    });
  });

  it('excludes kyeword with a value prefixed with `-`', () => {
    const parser = getParser('--user:testA', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [],
        exclude: [{ value: '-user:testA', isStrict: false }],
      },
      user: { include: [], exclude: [] },
    });
  });

  it('parses tokens separated by `-` as one token', () => {
    const parser = getParser('abc-def');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc-def', isStrict: false }], exclude: [] },
    });
  });

  it('excludes colons and `-` prefixed with `-`', () => {
    const parser = getParser('-: --: :- -:-');
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [{ value: ':-', isStrict: false }],
        exclude: [':', '-:', ':-'],
      },
    });
  });

  it('excludes common as value', () => {
    const parser = getParser('-common');
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [{ value: 'common', isStrict: false }] },
    });
  });

  it('excludes common as value of a `commmon` keyword', () => {
    const parser = getParser('common:-common');
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [{ value: 'common', isStrict: false }] },
    });
  });

  it('parses a single word inside of `""`', () => {
    const parser = getParser('"hello"', ['hello']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'hello', isStrict: true }], exclude: [] },
      hello: { include: [], exclude: [] },
    });
  });

  it('parses a single `"`', () => {
    const parser = getParser('"');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: '"', isStrict: false }], exclude: [] },
    });
  });

  it('skips an empty string', () => {
    const parser = getParser('""');
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
    });
  });

  it('parses an empty string follewed by a value', () => {
    const parser = getParser('"" abc');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc', isStrict: false }], exclude: [] },
    });
  });

  it('parses an empty string followed by a keyword with a value', () => {
    const parser = getParser('"" user:testA', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [{ value: 'testA', isStrict: false }], exclude: [] },
    });
  });

  it('skips an excluded empty `""` followed by a value', () => {
    const parser = getParser('user:-""testA', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: ['testA'], exclude: [] },
    });
  });

  it('treats an unclosed `"` as part of the word', () => {
    const parser = getParser('"abc def');
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: '"abc', isStrict: false },
          { value: 'def', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('treats an unclosed `"` as part of the word of surrounding words', () => {
    const parser = getParser('abc"def');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc"def', isStrict: false }], exclude: [] },
    });
  });

  it('parses a keyworded string', () => {
    const parser = getParser('user:"hello world"', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: {
        include: [{ value: 'hello world', isStrict: true }],
        exclude: [],
      },
    });
  });

  it('excludes a string', () => {
    const parser = getParser('-"hello world"');
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [],
        exclude: [{ value: 'hello world', isStrict: true }],
      },
    });
  });

  it('exclude keyworded string', () => {
    const parser = getParser('user:-"hello world"', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: {
        include: [],
        exclude: [{ value: '20', isStrict: true }],
      },
    });
  });

  it('parses an excluded keyword with a quoted value and includes the value', () => {
    const parser = getParser('-user:"hello world"', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [{ value: 'hello world', isStrict: true }],
        exclude: [{ value: 'user:', isStrict: false }],
      },
      user: { include: [], exclude: [] },
    });
  });

  it("treats string as a separate value when it isn't surrounded by spaces", () => {
    const parser = getParser('abc"hello world"def');
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: 'abc', isStrict: false },
          { value: 'hello world', isStrict: true },
          { value: 'def', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('splits a unique and a string separated by `-` on `"`', () => {
    const parser = getParser('abc-"hello world"');
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: 'abc-', isStrict: false },
          { value: 'hello world', isStrict: true },
        ],
        exclude: [],
      },
    });
  });
});
