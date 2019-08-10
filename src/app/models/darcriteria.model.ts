export interface Darcriteria {
  id?: string;
  name: string;
  description: string;
  weighting: CriteriaWeighting;
}

export enum CriteriaWeighting {
  Critical = 1,
  Important = 2,
  Desirable = 3
}
