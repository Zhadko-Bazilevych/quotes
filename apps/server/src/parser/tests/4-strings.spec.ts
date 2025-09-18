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

  it('wrong placed minus', () => {
    const parser = getParser('-user:"hello world"');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: '-user:hello world', include: true }],
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
