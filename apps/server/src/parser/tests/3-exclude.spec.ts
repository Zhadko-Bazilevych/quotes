import { getParser } from 'src/parser/tests';

describe('exclude', () => {
  it('single minus', () => {
    const parser = getParser('-', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('exclude common token', () => {
    const parser = getParser('-abc', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['abc'] },
      user: { include: [], exclude: [] },
    });
  });

  it('exclude keyword as a value', () => {
    const parser = getParser('-user', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['user'] },
      user: { include: [], exclude: [] },
    });
  });

  it('exclude keyword as a value with colon', () => {
    const parser = getParser('-user:', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['user:'] },
      user: { include: [], exclude: [] },
    });
  });

  it('exclude keyworded token incorrectly', () => {
    const parser = getParser('-user:test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['user:test1'] },
      user: { include: [], exclude: [] },
    });
  });

  it('minus as a value', () => {
    const parser = getParser('user: - ', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: [] },
    });
  });

  it('exclude multiple keyworded tokens', () => {
    const parser = getParser('user:-test1 content:-test2', ['user', 'content']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      content: { include: [], exclude: ['test2'] },
      user: { include: [], exclude: ['test1'] },
    });
  });

  it('partial exclude of multiple tokens of same keyword', () => {
    const parser = getParser('user:test1 -test2 content:-test3 test4 ', [
      'user',
      'content',
    ]);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      content: { include: ['test4'], exclude: ['test3'] },
      user: { include: ['test1'], exclude: ['test2'] },
    });
  });

  it('minus sign separated with whitespace', () => {
    const parser = getParser('  -  abc -  user:test1   test2', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: ['abc'], exclude: [] },
      user: { include: ['test1', 'test2'], exclude: [] },
    });
  });

  it('multiple minuses in a row', () => {
    const parser = getParser('--- ----', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['--', '---'] },
      user: { include: [], exclude: [] },
    });
  });

  it('multiple minuses near keyword', () => {
    const parser = getParser('--user:test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['-user:test1'] },
      user: { include: [], exclude: [] },
    });
  });

  it('multiple minuses near value', () => {
    const parser = getParser('user:--test1', ['user']);
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: [] },
      user: { include: [], exclude: ['-test1'] },
    });
  });

  it('minus in between tokens', () => {
    const parser = getParser('abc-def');
    expect(parser.parse()).toEqual({
      common: { include: ['abc-def'], exclude: [] },
    });
  });

  it('minus as combined value with colon', () => {
    const parser = getParser('-: --: :- -:-');
    expect(parser.parse()).toEqual({
      common: { include: [':-'], exclude: [':', '-:', ':-'] },
    });
  });

  it('exclude common as value', () => {
    const parser = getParser('-common');
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['common'] },
    });
  });

  it('exclude common as value keyworded with common', () => {
    const parser = getParser('common:-common');
    expect(parser.parse()).toEqual({
      common: { include: [], exclude: ['common'] },
    });
  });
});
