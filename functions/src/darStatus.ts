//import * as functions from "firebase-functions";
import { db } from "./init";

export enum DarStatus {
  evaluate = 1,
  vote = 2,
  confirm = 3,
  closed = 4,
  create = 5,
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

export interface DarNextStatusInfo {
  darStatus: DarStatus | null;
  darMethod: DarMethod | null;
  nextDarStatus: DarStatus | null;
  nextDarStatusExplanation: string;
  comments: string;
}

export async function onGetNextDarStatus(
  did: string
): Promise<DarNextStatusInfo> {
  // Will return the valid next DarStatus or null if no valid next status
  // Next status is based on the current DarStatus, methodology, the content of darsolution,darcriteria and daruser
  let darNextStatusInfo = <DarNextStatusInfo>{
    darStatus: null,
    darMethod: null,
    nextDarStatus: null,
    nextDarStatusExplanation: "",
    comments: ""
  };

  console.log("onGetNextDarStatus did", did);
  const docRef = db.collection("dars").doc(did);

  await docRef
    .get()
    .then(function(doc: any) {
      if (doc.exists) {
        const dar = doc.data();
        console.log("Document data:", dar);
        darNextStatusInfo.darMethod = dar.darMethod;
        darNextStatusInfo.darStatus = dar.darStatus;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function(error: any) {
      console.log("Error getting document:", error);
    });

  // Logic to work out next available status.
  // For documents in create status additional work is needed
  // to check darusers, darcriteria and dars

  return darNextStatusInfo;
}
