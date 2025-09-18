import { getParser } from 'src/parser/tests';

describe('exclude', () => {
  it('single minus', () => {
    const parser = getParser('-');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude common token', () => {
    const parser = getParser('-abc');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'abc', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude keyword as a value', () => {
    const parser = getParser('-user');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'user', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude keyword as a value with colon', () => {
    const parser = getParser('-user:');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'user:', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude keyworded token incorrectly', () => {
    const parser = getParser('-user:test1');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'user:test1', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('minus as a value', () => {
    const parser = getParser('user: - ');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude keyworded tokens', () => {
    const parser = getParser(
      'user:-test1 content:-test2 context:-test3 author:-test4',
    );
    expect(parser.parse()).toEqual({
      author: [{ value: 'test4', include: false }],
      common: [],
      content: [{ value: 'test2', include: false }],
      context: [{ value: 'test3', include: false }],
      user: [{ value: 'test1', include: false }],
    });
  });

  it('partial exclude of multiple tokens of same keyword', () => {
    const parser = getParser(
      'author:test1 -test2 context:-test3 test4 user:-test5 -test6 content:test7 test8',
    );
    expect(parser.parse()).toEqual({
      author: [
        { value: 'test1', include: true },
        { value: 'test2', include: false },
      ],
      common: [],
      content: [
        { value: 'test7', include: true },
        { value: 'test8', include: true },
      ],
      context: [
        { value: 'test3', include: false },
        { value: 'test4', include: true },
      ],
      user: [
        { value: 'test5', include: false },
        { value: 'test6', include: false },
      ],
    });
  });

  it('minus sign separated with whitespace', () => {
    const parser = getParser('  -  abc -  user:test1   test2');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'abc', include: true }],
      content: [],
      context: [],
      user: [
        { value: 'test1', include: true },
        { value: 'test2', include: true },
      ],
    });
  });

  it('multiple minuses in a row', () => {
    const parser = getParser('--- ----');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: '--', include: false },
        { value: '---', include: false },
      ],
      content: [],
      context: [],
      user: [],
    });
  });

  it('multiple minuses near keyword', () => {
    const parser = getParser('--user:test1');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: '-user:test1', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('multiple minuses near value', () => {
    const parser = getParser('content:--test1');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [{ value: '-test1', include: false }],
      context: [],
      user: [],
    });
  });

  it('minus in between tokens', () => {
    const parser = getParser('abc-def');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'abc-def', include: true }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('minus as combined value with colon', () => {
    const parser = getParser('-: --: :- -:-');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: ':', include: false },
        { value: '-:', include: false },
        { value: ':-', include: true },
        { value: ':-', include: false },
      ],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude common as value', () => {
    const parser = getParser('-common');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'common', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude common as value keyworded with common', () => {
    const parser = getParser('common:-common');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'common', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });
});
