export interface Daruser {
  id?: string;
  email: string;
  displayName?: string;
  solutionVote?: {
    dsid: string;
    name: string;
  };
  confirmed?: boolean;
  comments?: string;
  isEvaluator?: boolean;
  isReader?: boolean;
  isOwner?: boolean;
  isStakeholder?: boolean;
  isVoter?: boolean;
}
