import { getParser } from 'src/parser/tests';

describe('keywords', () => {
  it('single keyworded token', () => {
    const parser = getParser('user:abc', ['user', 'content']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      content: { include: [], exclude: [] },
      user: { include: ['abc'], exclude: [] },
    });
  });

  it('single keyword', () => {
    const parser = getParser('user', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['user'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('single colon', () => {
    const parser = getParser(': :: :::', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [':', '::', ':::'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('keyworded colons', () => {
    const parser = getParser('user:: content::: author:: :: :::', [
      'user',
      'author',
      'content',
    ]);
    expect(parser.parse()).toEqual({
      author: { include: [':', '::', ':::'], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: ['::'], exclude: [] },
      user: { include: [':'], exclude: [] },
    });
  });

  it('multiple keywords', () => {
    const parser = getParser('user:test1 content:test2 author:test3', [
      'user',
      'content',
      'author',
    ]);
    expect(parser.parse()).toEqual({
      author: { include: ['test3'], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: ['test2'], exclude: [] },
      user: { include: ['test1'], exclude: [] },
    });
  });

  it('multiple keywords of same type', () => {
    const parser = getParser(
      'author:test1 content:test2 user:test3 user:test4 content:test5 author:test6',
      ['user', 'content', 'author'],
    );
    expect(parser.parse()).toEqual({
      author: { include: ['test1', 'test6'], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: ['test2', 'test5'], exclude: [] },
      user: { include: ['test3', 'test4'], exclude: [] },
    });
  });

  it('multiple values after keyword', () => {
    const parser = getParser(
      'abc user:test1 content:test2 test3 author:test4 test5 test6',
      ['user', 'content', 'author'],
    );
    expect(parser.parse()).toEqual({
      common: { include: ['abc'], exclude: [] },
      content: { include: ['test2', 'test3'], exclude: [] },
      author: { include: ['test4', 'test5', 'test6'], exclude: [] },
      user: { include: ['test1'], exclude: [] },
    });
  });

  it('spaces between keyword and value', () => {
    const parser = getParser(' user:test1  content:  test2 author   :test3  ', [
      'user',
      'content',
      'author',
    ]);
    expect(parser.parse()).toEqual({
      author: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: ['test2', 'author', ':test3'], exclude: [] },
      user: { include: ['test1'], exclude: [] },
    });
  });

  it('value as keyword', () => {
    const parser = getParser('user:author content:content content:user', [
      'content',
      'author',
      'user',
    ]);
    expect(parser.parse()).toEqual({
      author: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
      content: { include: ['content', 'user'], exclude: [] },
      user: { include: ['author'], exclude: [] },
    });
  });

  it('multiple keywords followed with colon', () => {
    const parser = getParser('user:content: test1', ['user', 'content']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      content: { include: ['test1'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('multiple same keywords followed with colon', () => {
    const parser = getParser('user:user:', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('using common keyword', () => {
    const parser = getParser('common:test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['test1'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('using common keyword as value', () => {
    const parser = getParser('common', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['common'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('using common as value keyworded with common', () => {
    const parser = getParser('common:common', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['common'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('multiple common keywords followed with colon', () => {
    const parser = getParser('common:common: test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['test1'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });
});
