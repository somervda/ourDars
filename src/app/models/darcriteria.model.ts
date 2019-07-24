export interface Darcriteria {
    id?: string;
    name: string;
    description: string;
    weighting: CriteriaWeighting;
  }

  export enum CriteriaWeighting {
    Critical = "C",
    Important = "I",
    NiceToHave = "N"
  }
  