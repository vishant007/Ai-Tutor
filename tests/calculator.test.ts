import { Calculator } from '@/tools/calculator';

describe('Calculator', () => {
  describe('evaluate', () => {
    it('should evaluate basic arithmetic expressions', () => {
      expect(Calculator.evaluate('2 + 2')).toBe(4);
      expect(Calculator.evaluate('10 - 5')).toBe(5);
      expect(Calculator.evaluate('3 * 4')).toBe(12);
      expect(Calculator.evaluate('15 / 3')).toBe(5);
    });

    it('should handle decimal numbers', () => {
      expect(Calculator.evaluate('2.5 + 3.5')).toBe(6);
      expect(Calculator.evaluate('10.5 / 2')).toBe(5.25);
    });

    it('should handle parentheses', () => {
      expect(Calculator.evaluate('(2 + 3) * 4')).toBe(20);
      expect(Calculator.evaluate('10 / (2 + 3)')).toBe(2);
    });

    it('should reject unsafe expressions', () => {
      expect(() => Calculator.evaluate('eval("malicious code")')).toThrow('Unsafe expression detected');
      expect(() => Calculator.evaluate('process.exit()')).toThrow('Unsafe expression detected');
    });

    it('should handle invalid expressions', () => {
      expect(() => Calculator.evaluate('2 + ')).toThrow();
      expect(() => Calculator.evaluate('2 + * 3')).toThrow();
    });
  });

  describe('extractExpression', () => {
    it('should extract expressions from text', () => {
      expect(Calculator.extractExpression('calculate 2 + 2')).toBe('2 + 2');
      expect(Calculator.extractExpression('solve 3 * 4')).toBe('3 * 4');
      expect(Calculator.extractExpression('compute 10 / 2')).toBe('10 / 2');
      expect(Calculator.extractExpression('evaluate 5 - 3')).toBe('5 - 3');
    });

    it('should handle expressions without keywords', () => {
      expect(Calculator.extractExpression('2 + 2')).toBe('2 + 2');
      expect(Calculator.extractExpression('3 * 4')).toBe('3 * 4');
    });

    it('should return null for non-mathematical text', () => {
      expect(Calculator.extractExpression('hello world')).toBeNull();
      expect(Calculator.extractExpression('')).toBeNull();
    });
  });
}); 