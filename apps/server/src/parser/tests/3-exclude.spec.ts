import { getParser } from 'src/parser/tests';

describe('exclude', () => {
  it('exclude nothing', () => {
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

  it('exclude keyworded tokens', () => {
    const parser = getParser(
      '-user:test1 -content:test2 -context:test3 -author:test4',
    );
    expect(parser.parse()).toEqual({
      author: [{ value: 'test4', include: false }],
      common: [],
      content: [{ value: 'test2', include: false }],
      context: [{ value: 'test3', include: false }],
      user: [{ value: 'test1', include: false }],
    });
  });

  it('exclude tokens separated with whitespace', () => {
    const parser = getParser('-  user:test1  -  abc');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'abc', include: false }],
      content: [],
      context: [],
      user: [{ value: 'test1', include: false }],
    });
  });

  it('multiple minuses in a row', () => {
    const parser = getParser('---');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('multiple minuses near tokens', () => {
    const parser = getParser('--author:test1 --- content:test2');
    expect(parser.parse()).toEqual({
      author: [{ value: 'test1', include: false }],
      common: [],
      content: [{ value: 'test2', include: false }],
      context: [],
      user: [],
    });
  });

  it('minus in between words', () => {
    const parser = getParser('abc-def');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: 'abc', include: true },
        { value: 'def', include: false },
      ],
      content: [],
      context: [],
      user: [],
    });
  });
});
