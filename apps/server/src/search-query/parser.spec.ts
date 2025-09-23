import { Lexer } from 'src/search-query/lexer';
import { Parser } from 'src/search-query/parser';
import type { SafeKeyword, WithDefaultKeyword } from './search-query.types';

function getParser<
  TKeywordInput extends string,
  TKeyword extends WithDefaultKeyword<SafeKeyword<TKeywordInput>>,
>(input: string, keywords: TKeyword[] = []): Parser<TKeywordInput, TKeyword> {
  const lexer = new Lexer(input, keywords);
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
    const parser = getParser('user:test1 content:test2 author:test3', [
      'user',
      'content',
      'author',
    ]);
    expect(parser.parse()).toStrictEqual({
      author: { include: [{ value: 'test3', isStrict: false }], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: [{ value: 'test2', isStrict: false }], exclude: [] },
      user: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
    });
  });

  it('parses multiple keywords of same type into one keyword', () => {
    const parser = getParser(
      'author:test1 content:test2 user:test3 user:test4 content:test5 author:test6',
      ['user', 'content', 'author'],
    );
    expect(parser.parse()).toStrictEqual({
      author: {
        include: [
          { value: 'test1', isStrict: false },
          { value: 'test6', isStrict: false },
        ],
        exclude: [],
      },
      common: { include: [], exclude: [] },
      content: {
        include: [
          { value: 'test2', isStrict: false },
          { value: 'test5', isStrict: false },
        ],
        exclude: [],
      },
      user: {
        include: [
          { value: 'test3', isStrict: false },
          { value: 'test4', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('parses multiple values after a keyword', () => {
    const parser = getParser(
      'test1 test2 user:test1 content:test2 test3 author:test4 test5 test6',
      ['user', 'content', 'author'],
    );
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [
          { value: 'test1', isStrict: false },
          { value: 'test2', isStrict: false },
        ],
        exclude: [],
      },
      user: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
      content: {
        include: [
          { value: 'test2', isStrict: false },
          { value: 'test3', isStrict: false },
        ],
        exclude: [],
      },
      author: {
        include: [
          { value: 'test4', isStrict: false },
          { value: 'test5', isStrict: false },
          { value: 'test6', isStrict: false },
        ],
        exclude: [],
      },
    });
  });

  it('removes spaces between keyword and value', () => {
    const parser = getParser(' user:test1  content:  test2 author   :test3  ', [
      'user',
      'content',
      'author',
    ]);
    expect(parser.parse()).toStrictEqual({
      author: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
      content: {
        include: [
          { value: 'test2', isStrict: false },
          { value: 'author', isStrict: false },
          { value: ':test3', isStrict: false },
        ],
        exclude: [],
      },
      user: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
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
    const parser = getParser('user:content: test1', ['user', 'content']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
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
    const parser = getParser('common:test1');
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
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
    const parser = getParser('-user:test1', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [],
        exclude: [{ value: 'user:test1', isStrict: false }],
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
    const parser = getParser('user:-test1 content:-test2', ['user', 'content']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: { include: [], exclude: [{ value: 'test2', isStrict: false }] },
      user: { include: [], exclude: [{ value: 'test1', isStrict: false }] },
    });
  });

  it('excludes only values prefixed with `-`', () => {
    const parser = getParser('user:test1 -test2 content:-test3 test4 ', [
      'user',
      'content',
    ]);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      content: {
        include: [{ value: 'test4', isStrict: false }],
        exclude: [{ value: 'test3', isStrict: false }],
      },
      user: {
        include: [{ value: 'test1', isStrict: false }],
        exclude: [{ value: 'test2', isStrict: false }],
      },
    });
  });

  it('skips `-` surrounded by whitespaces', () => {
    const parser = getParser('  -  abc -  user:test1   test2', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [{ value: 'abc', isStrict: false }], exclude: [] },
      user: {
        include: [
          { value: 'test1', isStrict: false },
          { value: 'test2', isStrict: false },
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
    const parser = getParser('user:--test1', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [{ value: '-test1', isStrict: false }] },
    });
  });

  it('excludes kyeword with a value prefixed with `-`', () => {
    const parser = getParser('--user:test1', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: {
        include: [],
        exclude: [{ value: '-user:test1', isStrict: false }],
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
    const parser = getParser('"" user:test1', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
    });
  });

  it('skips an excluded empty `""` followed by a value', () => {
    const parser = getParser('user:-""test1', ['user']);
    expect(parser.parse()).toStrictEqual({
      common: { include: [], exclude: [] },
      user: { include: [{ value: 'test1', isStrict: false }], exclude: [] },
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
        exclude: [{ value: 'hello world', isStrict: true }],
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
