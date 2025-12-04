export type ValidRingNames = 'Cyclohexane' | 'Cyclopentane' | 'Benzene';

export interface Conformation {
  name: string;
  count: number;
  favorable: boolean;
}

export interface Ring {
  name: ValidRingNames;
  ccd: number;
  pdb: number;
  total: number;
  confs: Conformation[];
}
