export interface Darcriteria {
  id?: string;
  name: string;
  description: string;
  weighting: CriteriaWeighting;
}

export enum CriteriaWeighting {
  Critical = 0,
  Important = 1,
  Desirable = 2
}
