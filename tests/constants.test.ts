import { Constants } from '@/tools/constants';

describe('Constants', () => {
  describe('getConstant', () => {
    it('should return constant by name', () => {
      const constant = Constants.getConstant('speed_of_light');
      expect(constant).toBeDefined();
      expect(constant?.value).toBe(299792458);
      expect(constant?.unit).toBe('m/s');
    });

    it('should handle case-insensitive names', () => {
      const constant = Constants.getConstant('Speed of Light');
      expect(constant).toBeDefined();
      expect(constant?.value).toBe(299792458);
    });

    it('should return null for non-existent constants', () => {
      const constant = Constants.getConstant('non_existent_constant');
      expect(constant).toBeNull();
    });
  });

  describe('getAllConstants', () => {
    it('should return all constants', () => {
      const constants = Constants.getAllConstants();
      expect(Object.keys(constants)).toContain('speed_of_light');
      expect(Object.keys(constants)).toContain('gravitational_constant');
      expect(Object.keys(constants)).toContain('planck_constant');
    });
  });

  describe('formatConstant', () => {
    it('should format constant correctly', () => {
      const constant = Constants.getConstant('speed_of_light');
      expect(constant).toBeDefined();
      if (constant) {
        const formatted = Constants.formatConstant(constant);
        expect(formatted).toBe('299792458 m/s (Speed of light in vacuum)');
      }
    });
  });

  describe('findConstantsInText', () => {
    it('should find constants mentioned in text', () => {
      const text = 'What is the speed of light and gravitational constant?';
      const found = Constants.findConstantsInText(text);
      expect(found.length).toBe(2);
      expect(found[0].value).toBe(299792458);
      expect(found[1].value).toBe(6.67430e-11);
    });

    it('should return empty array for text without constants', () => {
      const text = 'Hello world';
      const found = Constants.findConstantsInText(text);
      expect(found).toHaveLength(0);
    });
  });
}); 