export interface Daruser {
  id?: string;
  email: string;
  displayName?: string;
  solutionVote?: string;
  comments?: string;
  isEvaluator?: boolean;
  isReader?: boolean;
  isOwner?: boolean;
  isStakeholder?: boolean;
  isVoter?: boolean;
}
