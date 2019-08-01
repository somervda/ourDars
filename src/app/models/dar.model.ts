import { Timestamp } from "@firebase/firestore-types";

export interface Dar {
  id?: string;
  title: string;
  description: string;
  dateCreated?: Date;
  dateTargeted?: Timestamp;
  dateClosed?: Date;
  darStatus: DarStatus;
  tid?: string;
  cause?: string;
  darMethod: DarMethod;
  // // Voting Majority : The percentage of votes - super majority - that are required to
  // // win the vote. i.e. 70  = 70% of votes must the reached to be the
  // // chosen solution. Special value of 0 indicates only a plurality of votes
  // // is required (simple majority)
  // votingMajority?: number;
  // // Number of votes each voter gets, typically 1
  // votesPerVoter?: number;
  risks?: string;
  constraints?: string;
  // Solution present after solution is chosen
  dsid?: string;
  // darUserIndexes : denormalized info from darUsers to allow role based
  // queries over the dars. This information is updated automatically using
  // cloud functions over the darUsers collection
  darUserIndexes?: {
    // isDarUser contains a uid for each user with access to the dar
    // it duplicates information in the other user uid arrays but will make
    // queries for myDars component more straight forward (Don't need to do a union on a set of 5 queries)
    isDarUser?: [string];
    isOwner?: [string];
    isStakeHolder?: [string];
    isEvaluator?: [string];
    isReader?: [string];
    isVoter?: [string];
  };
}

// Most common DAR status items that are used to search for
// "Active" dars for a user are given values less than 4
export enum DarStatus {
  active = 1,
  reviewed = 2,
  closed = 3,
  created = 4,
  deleted = 5
}

export enum DarMethod {
  // Vote : Dar users vote on best solution (Political process)
  Vote = 1,
  // Process : A standard DAR process is used that includes defining solutions, criteria and scoring options
  // before solutions are independently evaluated. Solution with the highest score is chosen
  Process = 2,
  // Hybrid : A process of scoring is used but final decision is still based on a vote, highest
  // scored solution may not be chosen
  Hybrid = 3
}
