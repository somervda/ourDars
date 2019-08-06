export interface Darsolution {
  id?: string;
  name: string;
  description: string;
  // Notes to help with the evaluations, i.e. how to get access to the solution etc
  evaluationNotes?: string;
  criteriaEvaluations?: CriteriaEvaluation[];
}

export interface CriteriaEvaluation {
  dcid: string;
  notes?: string;
  evaluationScore?: EvaluationScore;
}

export enum EvaluationScore {
  // 100% met
  "Fully Met" = 0,
  // Met criteria but things to be aware of (i.e. Non stated criteria my be in play - ie "w version to be aware of")
  "Met" = 1,
  // Mets the criteria under certain conditions i.e. "Need to purchase the support package"
  "Met with Workarounds" = 2,
  // The full description of the criteria is not met - but parts are
  "Partially Met" = 3,
  // No match with criteria
  "Not Met" = 4
}
