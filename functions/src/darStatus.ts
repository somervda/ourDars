import { DarMethod, DarStatus } from "./models";
import { db } from "./init";

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

  let darUserIndexes = {
    // isDarUser contains a uid for each user with access to the dar
    // it duplicates information in the other user uid arrays but will make
    // queries for myDars component more straight forward (Don't need to do a union on a set of 5 queries)
    isDarUser: [],
    isOwner: [],
    isStakeholder: [],
    isEvaluator: [],
    isReader: [],
    isVoter: []
  };

  console.log("onGetNextDarStatus did", did);
  const docRef = <FirebaseFirestore.DocumentReference>(
    db.collection("dars").doc(did)
  );

  await docRef
    .get()
    .then(function(doc: any) {
      if (doc.exists) {
        const dar = doc.data();
        console.log("Document data:", dar);
        darNextStatusInfo.darMethod = dar.darMethod;
        darNextStatusInfo.darStatus = dar.darStatus;
        darUserIndexes = dar.darUserIndexes;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        darNextStatusInfo.comments = "No such DAR document!";
      }
    })
    .catch(function(error: any) {
      console.log("Error getting document:", error);
      darNextStatusInfo.comments = "Error getting DAR document: " + error;
    });

  // Exit if DAR not found
  if (darNextStatusInfo.darStatus === null) return darNextStatusInfo;

  // Logic to work out next available status.
  // For documents in create status additional work is needed
  // to check darusers, darcriteria and dars
  if (darNextStatusInfo.darStatus === DarStatus.create) {
    // Need to check if darusers, darcriteria and darsolutions have been set
    // up before moving to the active statuses

    let isCriteriaReady = false;
    let isSolutionReady = false;
    let isUserReady = false;

    // Check criteria (Must be at least 1)
    const criteriaRef = <FirebaseFirestore.CollectionReference>db
      .collection("dars")
      .doc(did)
      .collection("darCriteria");
    await criteriaRef
      .get()
      .then(snaps => {
        if (snaps.docs.length > 0) {
          // At least one criteria must be defined
          isCriteriaReady = true;
        }
      })
      .catch(function(error: any) {
        console.error("Error getting darCriteria:", error);
      });

    // Check solutions (Must be at least 2)
    const solutionRef = <FirebaseFirestore.CollectionReference>db
      .collection("dars")
      .doc(did)
      .collection("darSolutions");
    await solutionRef
      .get()
      .then(snaps => {
        if (snaps.docs.length > 1) {
          // At least two solutions must be defined
          isSolutionReady = true;
        }
      })
      .catch(function(error: any) {
        console.error("Error getting darSolutions:", error);
      });

    // Check darUsers (Must be at least 1 stakeholder, if !process then 1 voter, if !vote then 1 evaluator)
    console.log("darUserIndexes", darUserIndexes);
    if (darUserIndexes) {
      if (
        darUserIndexes.isStakeholder &&
        darUserIndexes.isStakeholder.length > 0
      ) {
        if (
          darNextStatusInfo.darMethod === DarMethod.Process &&
          darUserIndexes.isEvaluator &&
          darUserIndexes.isEvaluator.length > 0
        )
          isUserReady = true;
        if (
          darNextStatusInfo.darMethod === DarMethod.Vote &&
          darUserIndexes.isVoter &&
          darUserIndexes.isVoter.length > 0
        )
          isUserReady = true;
        if (
          darNextStatusInfo.darMethod === DarMethod.Hybrid &&
          darUserIndexes.isEvaluator &&
          darUserIndexes.isEvaluator.length > 0 &&
          darUserIndexes.isVoter &&
          darUserIndexes.isVoter.length > 0
        )
          isUserReady = true;
      }
    }

    console.log("isCriteriaReady", isCriteriaReady);
    console.log("isSolutionReady", isSolutionReady);
    console.log("isUserReady", isUserReady);

    if (!isCriteriaReady)
      darNextStatusInfo.comments += "At least one criteria must be defined. ";
    if (!isSolutionReady)
      darNextStatusInfo.comments += "At least two solutions must be defined. ";
    if (!isUserReady)
      darNextStatusInfo.comments +=
        "Required user roles not defined; Stakeholder role is always required, " +
        " if methodology is Vote or Hybrid then a voter role is needed, if methodology is  Process " +
        " or Hybrid then an evaluator role is needed.";
    if (isCriteriaReady && isSolutionReady && isUserReady) {
      if (darNextStatusInfo.darMethod === DarMethod.Vote) {
        darNextStatusInfo.nextDarStatus = DarStatus.vote;
      } else {
        darNextStatusInfo.nextDarStatus = DarStatus.evaluate;
      }
    } else {
      darNextStatusInfo.nextDarStatusExplanation =
        "This DAR document can not move forward from " +
        "the create status until all basic DAR information is set up.";
    }
  }

  // For status other than create a simple decision tree is used

  if (darNextStatusInfo.darStatus === DarStatus.vote)
    darNextStatusInfo.nextDarStatus = DarStatus.confirm;

  if (darNextStatusInfo.darStatus === DarStatus.evaluate) {
    if (darNextStatusInfo.darMethod === DarMethod.Hybrid) {
      darNextStatusInfo.nextDarStatus = DarStatus.vote;
    } else {
      darNextStatusInfo.nextDarStatus = DarStatus.confirm;
    }
  }

  if (darNextStatusInfo.darStatus === DarStatus.confirm)
    darNextStatusInfo.nextDarStatus = DarStatus.closed;

  return darNextStatusInfo;
}
