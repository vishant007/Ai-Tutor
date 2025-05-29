interface PhysicsConstant {
  value: number;
  unit: string;
  description: string;
}

interface ConstantsMap {
  [key: string]: PhysicsConstant;
}

const PHYSICS_CONSTANTS: ConstantsMap = {
  'speed_of_light': {
    value: 299792458,
    unit: 'm/s',
    description: 'Speed of light in vacuum'
  },
  'gravitational_constant': {
    value: 6.67430e-11,
    unit: 'm³/kg/s²',
    description: 'Newtonian constant of gravitation'
  },
  'planck_constant': {
    value: 6.62607015e-34,
    unit: 'J⋅s',
    description: 'Planck constant'
  },
  'electron_mass': {
    value: 9.1093837015e-31,
    unit: 'kg',
    description: 'Electron mass'
  },
  'proton_mass': {
    value: 1.67262192369e-27,
    unit: 'kg',
    description: 'Proton mass'
  },
  'boltzmann_constant': {
    value: 1.380649e-23,
    unit: 'J/K',
    description: 'Boltzmann constant'
  }
};

export class Constants {
  static getConstant(name: string): PhysicsConstant | null {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '_');
    return PHYSICS_CONSTANTS[normalizedName] || null;
  }

  static getAllConstants(): ConstantsMap {
    return { ...PHYSICS_CONSTANTS };
  }

  static formatConstant(constant: PhysicsConstant): string {
    return `${constant.value} ${constant.unit} (${constant.description})`;
  }

  static findConstantsInText(text: string): PhysicsConstant[] {
    const foundConstants: PhysicsConstant[] = [];
    const words = text.toLowerCase().split(/\s+/);

    for (const [key, constant] of Object.entries(PHYSICS_CONSTANTS)) {
      if (words.some(word => key.includes(word) || constant.description.toLowerCase().includes(word))) {
        foundConstants.push(constant);
      }
    }

    return foundConstants;
  }
} 