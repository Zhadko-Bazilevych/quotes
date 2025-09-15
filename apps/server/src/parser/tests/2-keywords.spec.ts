import { getParser } from 'src/parser/tests';

describe('keywords', () => {
  it('single keyworded token', () => {
    const parser = getParser('user:abc');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [{ value: 'abc', include: true }],
    });
  });

  it('single keyword', () => {
    const parser = getParser('user');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'user', include: true }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('every keyword', () => {
    const parser = getParser(
      'user:test1 content:test2 context:test3 author:test4',
    );
    expect(parser.parse()).toEqual({
      author: [{ value: 'test4', include: true }],
      common: [],
      content: [{ value: 'test2', include: true }],
      context: [{ value: 'test3', include: true }],
      user: [{ value: 'test1', include: true }],
    });
  });

  it('multiple keywords of same type', () => {
    const parser = getParser(
      'author:test1 content:test2 context:test3 user:test4 user:test5 content:test6 context:test7 author:test8',
    );
    expect(parser.parse()).toEqual({
      author: [
        { value: 'test1', include: true },
        { value: 'test8', include: true },
      ],
      common: [],
      content: [
        { value: 'test2', include: true },
        { value: 'test6', include: true },
      ],
      context: [
        { value: 'test3', include: true },
        { value: 'test7', include: true },
      ],
      user: [
        { value: 'test4', include: true },
        { value: 'test5', include: true },
      ],
    });
  });

  it('spaces between keyword and value', () => {
    const parser = getParser(
      ' user:test1  content:  test2 context   :test3  author   :   test4  ',
    );
    expect(parser.parse()).toEqual({
      author: [{ value: 'test4', include: true }],
      common: [],
      content: [{ value: 'test2', include: true }],
      context: [{ value: 'test3', include: true }],
      user: [{ value: 'test1', include: true }],
    });
  });

  it('value as keyword', () => {
    const parser = getParser(
      'user:author content:content context:user author:content',
    );
    expect(parser.parse()).toEqual({
      author: [{ value: 'content', include: true }],
      common: [],
      content: [{ value: 'content', include: true }],
      context: [{ value: 'user', include: true }],
      user: [{ value: 'author', include: true }],
    });
  });

  it('keyworded tokens mixed with common', () => {
    const parser = getParser(
      'abc user:test1 content:test2 def context:test3 ghi jkl author:test4 mno',
    );
    expect(parser.parse()).toEqual({
      author: [{ value: 'test4', include: true }],
      common: [
        { value: 'abc', include: true },
        { value: 'def', include: true },
        { value: 'ghi', include: true },
        { value: 'jkl', include: true },
        { value: 'mno', include: true },
      ],
      content: [{ value: 'test2', include: true }],
      context: [{ value: 'test3', include: true }],
      user: [{ value: 'test1', include: true }],
    });
  });
});
