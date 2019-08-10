import { Timestamp } from "@firebase/firestore-types";

export interface Darevaluation {
  id?: string;
  notes?: string;
  evaluationScore?: EvaluationScore;
  // dateCreated automatically populated in cloud based onCreate function
  dateCreated?: Timestamp;
  // did and dsid are used in the evaluation heatmap/matrix views and
  // get auto-populated with the cloud based onCreate function
  did?: string;
  dsid?: string;

}

export enum EvaluationScore {
  // 100% met
  "Fully Met" = 1,
  // Met criteria but things to be aware of (i.e. Non stated criteria my be in play - ie "w version to be aware of")
  "Met" = 2,
  // Mets the criteria under certain conditions i.e. "Need to purchase the support package"
  "Met with Conditions" = 3,
  // The full description of the criteria is not met - but parts are
  "Partially Met" = 4,
  // No match with criteria
  "Not Met" = 5
}
