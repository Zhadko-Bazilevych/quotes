import { Lexer } from 'src/search-query/lexer';
import type { Token } from 'src/search-query/search-query.types';

describe('Lexer', () => {
  describe('readNext', () => {
    it('returns `eof` token every `readNext()` call on empty input', () => {
      const lexer = new Lexer('');
      expect(lexer.readNext()).toStrictEqual({ literal: '', type: 'eof' });
      expect(lexer.readNext()).toStrictEqual({ literal: '', type: 'eof' });
      expect(lexer.readNext()).toStrictEqual({ literal: '', type: 'eof' });
    });

    it('lexes a single literal as `unique` token', () => {
      const lexer = new Lexer('abc');
      expect(lexer.readNext()).toStrictEqual({
        literal: 'abc',
        type: 'unique',
      });
      expect(lexer.readNext()).toStrictEqual({ literal: '', type: 'eof' });
      expect(lexer.readNext()).toStrictEqual({ literal: '', type: 'eof' });
    });

    it('lexes multiple literals and returns `space` token for every space', () => {
      const lexer = new Lexer('  abc def  ghi  ');
      expect(lexer.readNext()).toStrictEqual({
        literal: 'abc',
        type: 'unique',
      });
      expect(lexer.readNext()).toStrictEqual({ literal: ' ', type: 'space' });
      expect(lexer.readNext()).toStrictEqual({
        literal: 'def',
        type: 'unique',
      });
      expect(lexer.readNext()).toStrictEqual({ literal: ' ', type: 'space' });
      expect(lexer.readNext()).toStrictEqual({ literal: ' ', type: 'space' });
      expect(lexer.readNext()).toStrictEqual({
        literal: 'ghi',
        type: 'unique',
      });
      expect(lexer.readNext()).toStrictEqual({ literal: '', type: 'eof' });
    });
  });

  describe('readAll', () => {
    it("doesn't return any token for empty input", () => {
      const lexer = new Lexer('');
      const res: Token[] = [];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes a single literal as `unique` token', () => {
      const lexer = new Lexer('abc');
      const res: Token[] = [{ literal: 'abc', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes multiple literals and returns `space` token for every space', () => {
      const lexer = new Lexer('  abc def  ghi  ');
      const res: Token[] = [
        { literal: 'abc', type: 'unique' },
        { literal: ' ', type: 'space' },
        { literal: 'def', type: 'unique' },
        { literal: ' ', type: 'space' },
        { literal: ' ', type: 'space' },
        { literal: 'ghi', type: 'unique' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes a single minus as `minus` token', () => {
      const lexer = new Lexer('-');
      const res: Token[] = [{ literal: '-', type: 'minus' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes a single colon as `colon` token', () => {
      const lexer = new Lexer(':');
      const res: Token[] = [{ literal: ':', type: 'colon' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes every keychar separately even in complex combinations', () => {
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
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes keychars, located between unique literals separately', () => {
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
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes `common` keyword without passing it to lexer', () => {
      const lexer = new Lexer('common');
      const res: Token[] = [{ literal: 'common', type: 'keyword' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes `common` keyword when empty keyword array passed', () => {
      const lexer = new Lexer('common', []);
      const res: Token[] = [{ literal: 'common', type: 'keyword' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes custom keyword passed into a lexer', () => {
      const lexer = new Lexer('user', ['user']);
      const res: Token[] = [{ literal: 'user', type: 'keyword' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes multiple custom keywords passed into a lexer', () => {
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
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('treats multiple keywords written without spaces as `unique` literal', () => {
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

      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes multiple keywords mixed with unique literals', () => {
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
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes word in quotes as `string` token', () => {
      const lexer = new Lexer('"hello"');
      const res: Token[] = [{ literal: 'hello', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes empty string as token with empty literal', () => {
      const lexer = new Lexer('""');
      const res: Token[] = [{ literal: '', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes string with spaces as single token', () => {
      const lexer = new Lexer('"hello world"');
      const res: Token[] = [{ literal: 'hello world', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes string containing keywords as `string` token', () => {
      const lexer = new Lexer('"common user"', ['user']);
      const res: Token[] = [{ literal: 'common user', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes string containing key characters as `string` token', () => {
      const lexer = new Lexer('"user:abc-def"', ['user']);
      const res: Token[] = [{ literal: 'user:abc-def', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes multiple strings separated with space', () => {
      const lexer = new Lexer('"hello" "world"', ['user']);
      const res: Token[] = [
        { literal: 'hello', type: 'string' },
        { literal: ' ', type: 'space' },
        { literal: 'world', type: 'string' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes multiple not separated strings or separated with unique literals', () => {
      const lexer = new Lexer('"hello"the"cruel""world"');
      const res: Token[] = [
        { literal: 'hello', type: 'string' },
        { literal: 'the', type: 'unique' },
        { literal: 'cruel', type: 'string' },
        { literal: 'world', type: 'string' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes multiple strings separated with key characters', () => {
      const lexer = new Lexer('"hello"-"cruel":"world"');
      const res: Token[] = [
        { literal: 'hello', type: 'string' },
        { literal: '-', type: 'minus' },
        { literal: 'cruel', type: 'string' },
        { literal: ':', type: 'colon' },
        { literal: 'world', type: 'string' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes single double-quote character as `unique` token', () => {
      const lexer = new Lexer('"');
      const res: Token[] = [{ literal: '"', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes not closed quotes as `unique` token', () => {
      const lexer = new Lexer('"hello world');
      const res: Token[] = [
        { literal: '"', type: 'unique' },
        { literal: 'hello', type: 'unique' },
        { literal: ' ', type: 'space' },
        { literal: 'world', type: 'unique' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes only last quotes as `unique` token if their amount is odd', () => {
      const lexer = new Lexer('"hello"world"');
      const res: Token[] = [
        { literal: 'hello', type: 'string' },
        { literal: 'world', type: 'unique' },
        { literal: '"', type: 'unique' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes quotes inside `unique` token with backslash', () => {
      const lexer = new Lexer('ab\\"c');
      const res: Token[] = [{ literal: 'ab"c', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes quotes inside string with backslash', () => {
      const lexer = new Lexer('"hello\\"world"');
      const res: Token[] = [{ literal: 'hello"world', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes space character with backslash', () => {
      const lexer = new Lexer('hello\\ world');
      const res: Token[] = [{ literal: 'hello world', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes any character with backslash', () => {
      const lexer = new Lexer('hel\\lo');
      const res: Token[] = [{ literal: 'hello', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes backslash with backslash', () => {
      const lexer = new Lexer('a\\\\bc');
      const res: Token[] = [{ literal: 'a\\bc', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes multiple backslashes with backslashes', () => {
      const lexer = new Lexer('a\\\\\\\\bc');
      const res: Token[] = [{ literal: 'a\\\\bc', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('remove backslash if it escape nothing in the end of input', () => {
      const lexer = new Lexer('abc\\');
      const res: Token[] = [{ literal: 'abc', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes quotes in the end of input', () => {
      const lexer = new Lexer('"hello\\"');
      const res: Token[] = [
        { literal: '"', type: 'unique' },
        { literal: 'hello"', type: 'unique' },
      ];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('escapes \\n and \\\\n as \\n', () => {
      const lexer = new Lexer('\nhello\\\ncruel\nworld\n');
      const res: Token[] = [{ literal: 'hello\ncruel\nworld', type: 'unique' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });

    it('lexes escape sequenced as they are', () => {
      const lexer = new Lexer('"\t\r\b\f\v\u03C0"');
      const res: Token[] = [{ literal: '\t\r\b\f\v\u03C0', type: 'string' }];
      expect(lexer.readAll()).toStrictEqual(res);
    });
  });
});
