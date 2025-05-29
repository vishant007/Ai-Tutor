export class Calculator {
  private static readonly SAFE_OPERATORS = /^[0-9+\-*/().\s]+$/;

  static evaluate(expression: string): number {
    if (!this.isSafeExpression(expression)) {
      throw new Error('Unsafe expression detected');
    }

    try {
      // Using Function constructor as a safer alternative to eval
      // Still needs to be used with caution and proper input validation
      const result = new Function(`return ${expression}`)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }

      return result;
    } catch (error) {
      throw new Error(`Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static isSafeExpression(expression: string): boolean {
    return this.SAFE_OPERATORS.test(expression);
  }

  static extractExpression(text: string): string | null {
    // Match expressions like "2 + 2" or "calculate 3 * 4"
    const match = text.match(/(?:calculate|compute|solve|evaluate)?\s*([0-9+\-*/().\s]+)/i);
    return match ? match[1].trim() : null;
  }
} 