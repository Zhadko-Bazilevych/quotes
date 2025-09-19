import { getParser } from 'src/parser/tests';

describe('letters only', () => {
  it('empty query', () => {
    const parser = getParser('', ['user', 'common']);
    expect(parser.parse()).toEqual({
      user: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
    });
  });

  it('always return common field', () => {
    const parser = getParser('');
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
    });
  });

  it('single word', () => {
    const parser = getParser('abc', ['user']);
    expect(parser.parse()).toEqual({
      user: { include: [], exclude: [] },
      common: { include: ['abc'], exclude: [] },
    });
  });

  it('only spaces', () => {
    const parser = getParser('     ', ['user']);
    expect(parser.parse()).toEqual({
      user: { include: [], exclude: [] },
      common: { include: [], exclude: [] },
    });
  });

  it('multiple words', () => {
    const parser = getParser(' abc def   ghi ', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['abc', 'def', 'ghi'], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });
});
