// Most common DAR status items that are used to search for
// "Active" dars for a user are given values less than 5
// create and delete have restricted viewing rights
export enum DarStatus {
  design = 1,
  evaluate = 2,
  vote = 3,
  confirm = 4,
  closed = 5,
  deleted = 6
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
