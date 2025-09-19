import { getParser } from 'src/parser/tests';

describe('strings', () => {
  it('single string', () => {
    const parser = getParser('"hello"', ['hello']);
    expect(parser.parse()).toEqual({
      common: { include: ['hello'], exclude: [] },
      hello: { include: [], exclude: [] },
    });
  });

  it('single quotes', () => {
    const parser = getParser('"');
    expect(parser.parse()).toEqual({
      common: { include: ['"'], exclude: [] },
    });
  });

  it('empty string', () => {
    const parser = getParser('""');
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
    });
  });

  it('empty string follewed by value', () => {
    const parser = getParser('"" abc');
    expect(parser.parse()).toEqual({
      common: { include: ['abc'], exclude: [] },
    });
  });

  it('empty string followed by keyword', () => {
    const parser = getParser('"" user:test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: ['test1'], exclude: [] },
    });
  });

  it('exclude empty string followed by value', () => {
    const parser = getParser('user:-""test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: ['test1'], exclude: [] },
    });
  });

  it('not closed quotes', () => {
    const parser = getParser('"abc def');
    expect(parser.parse()).toEqual({
      common: { include: ['"abc', 'def'], exclude: [] },
    });
  });

  it('keyworded string', () => {
    const parser = getParser('user:"hello world"', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: ['hello world'], exclude: [] },
    });
  });

  it('exclude string', () => {
    const parser = getParser('-"hello world"');
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['hello world'] },
    });
  });

  it('exclude keyworded string', () => {
    const parser = getParser('user:-"hello world"', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: ['hello world'] },
    });
  });

  it('incorrectly placed minus', () => {
    const parser = getParser('-user:"hello world"', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['hello world'], exclude: ['user:'] },
      user: { include: [], exclude: [] },
    });
  });

  it('string in between words', () => {
    const parser = getParser('abc"hello world"def');
    expect(parser.parse()).toEqual({
      common: { include: ['abc', 'hello world', 'def'], exclude: [] },
    });
  });

  it('unique and string separated with minus', () => {
    const parser = getParser('abc-"hello world"');
    expect(parser.parse()).toEqual({
      common: { include: ['abc-', 'hello world'], exclude: [] },
    });
  });
});
