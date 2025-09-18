import { getParser } from 'src/parser/tests';

describe('strings', () => {
  it('single string', () => {
    const parser = getParser('"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'hello world', include: true }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('single quotes', () => {
    const parser = getParser('"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: '"', include: true }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('empty string', () => {
    const parser = getParser('""');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('empty string follewed by value', () => {
    const parser = getParser('"" abc');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'abc', include: true }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('empty string followed by keyword', () => {
    const parser = getParser('"" context:test1');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [{ value: 'test1', include: true }],
      user: [],
    });
  });

  it('exclude empty string followed by value', () => {
    const parser = getParser('author:-""test1');
    expect(parser.parse()).toEqual({
      author: [{ value: 'test1', include: true }],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('not closed quotes', () => {
    const parser = getParser('"abc def');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: '"abc', include: true },
        { value: 'def', include: true },
      ],
      content: [],
      context: [],
      user: [],
    });
  });

  it('keyworded string', () => {
    const parser = getParser('user:"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [{ value: 'hello world', include: true }],
    });
  });

  it('exclude string', () => {
    const parser = getParser('-"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'hello world', include: false }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('exclude keyworded string', () => {
    const parser = getParser('content:-"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [{ value: 'hello world', include: false }],
      context: [],
      user: [],
    });
  });

  it('incorrectly placed minus', () => {
    const parser = getParser('-user:"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: 'user:', include: false },
        { value: 'hello world', include: true },
      ],
      content: [],
      context: [],
      user: [],
    });
  });

  it('string in between words', () => {
    const parser = getParser('abc"hello world"def');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: 'abc', include: true },
        { value: 'hello world', include: true },
        { value: 'def', include: true },
      ],
      content: [],
      context: [],
      user: [],
    });
  });

  it('unique and string separated with minus', () => {
    const parser = getParser('abc-"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: 'abc-', include: true },
        { value: 'hello world', include: true },
      ],
      content: [],
      context: [],
      user: [],
    });
  });
});
