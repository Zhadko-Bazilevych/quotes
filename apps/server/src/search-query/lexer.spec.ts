import { Lexer } from 'src/search-query/lexer';
import type { Token } from 'src/search-query/search-query.types';

describe('readNext - unique literals', () => {
  it('empty input', () => {
    const lexer = new Lexer('');
    expect(lexer.readNext()).toEqual({ literal: '', type: 'eof' });
    expect(lexer.readNext()).toEqual({ literal: '', type: 'eof' });
    expect(lexer.readNext()).toEqual({ literal: '', type: 'eof' });
  });

  it('single literal', () => {
    const lexer = new Lexer('abc');
    expect(lexer.readNext()).toEqual({ literal: 'abc', type: 'unique' });
    expect(lexer.readNext()).toEqual({ literal: '', type: 'eof' });
    expect(lexer.readNext()).toEqual({ literal: '', type: 'eof' });
  });

  it('multiple literals', () => {
    const lexer = new Lexer('  abc def  ghi  ');
    expect(lexer.readNext()).toEqual({ literal: 'abc', type: 'unique' });
    expect(lexer.readNext()).toEqual({ literal: ' ', type: 'space' });
    expect(lexer.readNext()).toEqual({ literal: 'def', type: 'unique' });
    expect(lexer.readNext()).toEqual({ literal: ' ', type: 'space' });
    expect(lexer.readNext()).toEqual({ literal: ' ', type: 'space' });
    expect(lexer.readNext()).toEqual({ literal: 'ghi', type: 'unique' });
    expect(lexer.readNext()).toEqual({ literal: '', type: 'eof' });
  });
});

describe('readAll - unique literals', () => {
  it('empty input', () => {
    const lexer = new Lexer('');
    const res: Token[] = [];
    expect(lexer.readAll()).toEqual(res);
  });

  it('single literal', () => {
    const lexer = new Lexer('abc');
    const res: Token[] = [{ literal: 'abc', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('multiple literals', () => {
    const lexer = new Lexer('  abc def  ghi  ');
    const res: Token[] = [
      { literal: 'abc', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: 'def', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: ' ', type: 'space' },
      { literal: 'ghi', type: 'unique' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });
});

describe('keywords', () => {
  it('common keyword', () => {
    const lexer = new Lexer('common');
    const res: Token[] = [{ literal: 'common', type: 'keyword' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('empty keyword array', () => {
    const lexer = new Lexer('common', []);
    const res: Token[] = [{ literal: 'common', type: 'keyword' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('custom keyword', () => {
    const lexer = new Lexer('user', ['user']);
    const res: Token[] = [{ literal: 'user', type: 'keyword' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('multiple keywords', () => {
    const lexer = new Lexer('user common content user', ['user', 'content']);
    const res: Token[] = [
      { literal: 'user', type: 'keyword' },
      { literal: ' ', type: 'space' },
      { literal: 'common', type: 'keyword' },
      { literal: ' ', type: 'space' },
      { literal: 'content', type: 'keyword' },
      { literal: ' ', type: 'space' },
      { literal: 'user', type: 'keyword' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('multiple non-whitespaced keywords', () => {
    const lexer = new Lexer('usercommon useruser commoncommon', ['user']);
    const res: Token[] = [
      {
        literal: 'usercommon',
        type: 'unique',
      },
      { literal: ' ', type: 'space' },
      { literal: 'useruser', type: 'unique' },
      { literal: ' ', type: 'space' },
      {
        literal: 'commoncommon',
        type: 'unique',
      },
    ];

    expect(lexer.readAll()).toEqual(res);
  });

  it('keywords mixed with uniques', () => {
    const lexer = new Lexer('abc common def ghi user klm', ['user']);
    const res: Token[] = [
      { literal: 'abc', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: 'common', type: 'keyword' },
      { literal: ' ', type: 'space' },
      { literal: 'def', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: 'ghi', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: 'user', type: 'keyword' },
      { literal: ' ', type: 'space' },
      { literal: 'klm', type: 'unique' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });
});

describe('keychars', () => {
  it('single minus', () => {
    const lexer = new Lexer('-');
    const res: Token[] = [{ literal: '-', type: 'minus' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('single colon', () => {
    const lexer = new Lexer(':');
    const res: Token[] = [{ literal: ':', type: 'colon' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('multiple keychars', () => {
    const lexer = new Lexer(': - :-:');
    const res: Token[] = [
      { literal: ':', type: 'colon' },
      { literal: ' ', type: 'space' },
      { literal: '-', type: 'minus' },
      { literal: ' ', type: 'space' },
      { literal: ':', type: 'colon' },
      { literal: '-', type: 'minus' },
      { literal: ':', type: 'colon' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('keychars with uniques', () => {
    const lexer = new Lexer('user:abc def-common', ['user']);
    const res: Token[] = [
      { literal: 'user', type: 'keyword' },
      { literal: ':', type: 'colon' },
      { literal: 'abc', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: 'def', type: 'unique' },
      { literal: '-', type: 'minus' },
      { literal: 'common', type: 'keyword' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });
});

describe('strings', () => {
  it('empty string', () => {
    const lexer = new Lexer('""');
    const res: Token[] = [{ literal: '', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('simple string', () => {
    const lexer = new Lexer('"hello"');
    const res: Token[] = [{ literal: 'hello', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('string with spaces', () => {
    const lexer = new Lexer('"hello world"');
    const res: Token[] = [{ literal: 'hello world', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('string with keywords', () => {
    const lexer = new Lexer('"common user"', ['user']);
    const res: Token[] = [{ literal: 'common user', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('string with keychars', () => {
    const lexer = new Lexer('"user:abc-def"', ['user']);
    const res: Token[] = [{ literal: 'user:abc-def', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('multiple strings', () => {
    const lexer = new Lexer('"hello" "world"', ['user']);
    const res: Token[] = [
      { literal: 'hello', type: 'string' },
      { literal: ' ', type: 'space' },
      { literal: 'world', type: 'string' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('strings and uniques', () => {
    const lexer = new Lexer('"hello"the"cruel""world"');
    const res: Token[] = [
      { literal: 'hello', type: 'string' },
      { literal: 'the', type: 'unique' },
      { literal: 'cruel', type: 'string' },
      { literal: 'world', type: 'string' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('strings and keychars', () => {
    const lexer = new Lexer('"hello"-"cruel":"world"');
    const res: Token[] = [
      { literal: 'hello', type: 'string' },
      { literal: '-', type: 'minus' },
      { literal: 'cruel', type: 'string' },
      { literal: ':', type: 'colon' },
      { literal: 'world', type: 'string' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('single quotes', () => {
    const lexer = new Lexer('"');
    const res: Token[] = [{ literal: '"', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('unclosed quotes', () => {
    const lexer = new Lexer('"hello world');
    const res: Token[] = [
      { literal: '"', type: 'unique' },
      { literal: 'hello', type: 'unique' },
      { literal: ' ', type: 'space' },
      { literal: 'world', type: 'unique' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('odd amount of quotes', () => {
    const lexer = new Lexer('"hello"world"');
    const res: Token[] = [
      { literal: 'hello', type: 'string' },
      { literal: 'world', type: 'unique' },
      { literal: '"', type: 'unique' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });
});

describe('character escaping', () => {
  it('unique literal with quotes', () => {
    const lexer = new Lexer('ab\\"c');
    const res: Token[] = [{ literal: 'ab"c', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('string with quotes', () => {
    const lexer = new Lexer('"hello\\"world"');
    const res: Token[] = [{ literal: 'hello"world', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('escaping basic char', () => {
    const lexer = new Lexer('hel\\lo');
    const res: Token[] = [{ literal: 'hello', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('escaping space', () => {
    const lexer = new Lexer('hello\\ world');
    const res: Token[] = [{ literal: 'hello world', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('escaping backslash', () => {
    const lexer = new Lexer('a\\\\bc');
    const res: Token[] = [{ literal: 'a\\bc', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('escaping two backslashes', () => {
    const lexer = new Lexer('a\\\\\\\\bc');
    const res: Token[] = [{ literal: 'a\\\\bc', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('backslash at the end', () => {
    const lexer = new Lexer('abc\\');
    const res: Token[] = [{ literal: 'abc', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('backslash at closing quotes', () => {
    const lexer = new Lexer('"hello\\"');
    const res: Token[] = [
      { literal: '"', type: 'unique' },
      { literal: 'hello"', type: 'unique' },
    ];
    expect(lexer.readAll()).toEqual(res);
  });

  it('escape \\n', () => {
    const lexer = new Lexer('\nhello\\\ncruel\nworld\n');
    const res: Token[] = [{ literal: 'hello\ncruel\nworld', type: 'unique' }];
    expect(lexer.readAll()).toEqual(res);
  });

  it('lexes escape sequenced as they are', () => {
    const lexer = new Lexer('"\t\r\b\f\v\u03C0"');
    const res: Token[] = [{ literal: '\t\r\b\f\v\u03C0', type: 'string' }];
    expect(lexer.readAll()).toEqual(res);
  });
});
