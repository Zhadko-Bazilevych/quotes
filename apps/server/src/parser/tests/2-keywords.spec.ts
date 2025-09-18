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

  it('single colon', () => {
    const parser = getParser(': :: :::');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: ':', include: true },
        { value: '::', include: true },
        { value: ':::', include: true },
      ],
      content: [],
      context: [],
      user: [],
    });
  });

  it('keyworded colons', () => {
    const parser = getParser('user:: content::: author:: :: :::');
    expect(parser.parse()).toEqual({
      author: [
        { value: ':', include: true },
        { value: '::', include: true },
        { value: ':::', include: true },
      ],
      common: [],
      content: [{ value: '::', include: true }],
      context: [],
      user: [{ value: ':', include: true }],
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

  it('multiple values after keyword', () => {
    const parser = getParser(
      'abc user:test1 content:test2 test3 context:test4 test5 test6 author:test7 test8',
    );
    expect(parser.parse()).toEqual({
      author: [
        { value: 'test7', include: true },
        { value: 'test8', include: true },
      ],
      common: [{ value: 'abc', include: true }],
      content: [
        { value: 'test2', include: true },
        { value: 'test3', include: true },
      ],
      context: [
        { value: 'test4', include: true },
        { value: 'test5', include: true },
        { value: 'test6', include: true },
      ],
      user: [{ value: 'test1', include: true }],
    });
  });

  it('spaces between keyword and value', () => {
    const parser = getParser(
      ' user:test1  content:  test2 context   :test3  author   :   test4  ',
    );
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [
        { value: 'test2', include: true },
        { value: 'context', include: true },
        { value: ':test3', include: true },
        { value: 'author', include: true },
        { value: ':', include: true },
        { value: 'test4', include: true },
      ],
      context: [],
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
});
