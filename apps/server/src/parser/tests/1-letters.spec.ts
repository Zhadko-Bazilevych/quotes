import { getParser } from 'src/parser/tests';

describe('letters only', () => {
  it('single word', () => {
    const parser = getParser('abc');
    expect(parser.parse()).toEqual({
      author: [],
      common: [{ value: 'abc', include: true }],
      content: [],
      context: [],
      user: [],
    });
  });

  it('empty query', () => {
    const parser = getParser('');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('only spaces', () => {
    const parser = getParser('     ');
    expect(parser.parse()).toEqual({
      author: [],
      common: [],
      content: [],
      context: [],
      user: [],
    });
  });

  it('multiple words', () => {
    const parser = getParser(' abc def   ghi ');
    expect(parser.parse()).toEqual({
      author: [],
      common: [
        { value: 'abc', include: true },
        { value: 'def', include: true },
        { value: 'ghi', include: true },
      ],
      content: [],
      context: [],
      user: [],
    });
  });
});
