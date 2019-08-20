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
  if (darNextStatusInfo.darStatus === DarStatus.create) {
    // Need to check if darusers, darcriteria and darsolutions have been set
    // up before moving to the active statuses

    let isCriteriaReady = false;
    let isSolutionReady = false;

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

    console.log("isCriteriaReady", isCriteriaReady);
    console.log("isSolutionReady", isSolutionReady);

    if (!isCriteriaReady)
      darNextStatusInfo.comments += "At least one criteria must be defined. ";
    if (!isSolutionReady)
      darNextStatusInfo.comments += "At least two solutions must be defined. ";
    if (isCriteriaReady || isSolutionReady) {
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

  return darNextStatusInfo;
}
