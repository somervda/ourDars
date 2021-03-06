export interface Daruser {
  id?: string;
  email: string;
  displayName?: string;
  solutionVote?: {
    dsid: string;
    name: string;
  };
  voteComment?: string;
  confirmed?: boolean;
  confirmComment?: string;
  isEvaluator?: boolean;
  isReader?: boolean;
  isOwner?: boolean;
  isStakeholder?: boolean;
  isVoter?: boolean;
}
