import { DarMethod, DarStatus } from "./models";
import * as functions from "firebase-functions";
import { db } from "./init";

export interface DarNextStatusInfo {
  nextDarStatus: DarStatus | null;
  nextDarStatusExplanation: string;
  comments: string;
}

// *******  HTTP Tester ****

export const getNextDarStatus = functions.https.onRequest(
  async (request, response) => {
    // Use to test the onGetNextDarStatus function
    // https://us-central1-ourdars-7b9e2.cloudfunctions.net/getNextDarStatus/s32tXhTTmAO3OiCgkpVK
    console.log("request.params", request.params["0"]);
    let pathParam = request.params["0"];
    if (pathParam.slice(0, 1) === "/") pathParam = pathParam.substr(1);
    let x: DarNextStatusInfo;

    x = await onGetNextDarStatus(pathParam);
    console.log("x:", x);
    response.send(
      "Version:1.05,   DocId:" +
        pathParam +
        ",   Comments:" +
        x.comments +
        ",   explanation:" +
        x.nextDarStatusExplanation +
        ",   nextStatus:" +
        x.nextDarStatus
    );
  }
);

// **** Supporting functions *

export async function onGetNextDarStatus(
  did: string
): Promise<DarNextStatusInfo> {
  // Will return the valid next DarStatus or null if no valid next status
  // Next status is based on the current DarStatus, methodology, the content of darsolution,darcriteria and daruser
  let darNextStatusInfo = <DarNextStatusInfo>{
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
  let dsid = "";
  let darStatus = null;
  let darMethod = null;

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
        darMethod = dar.darMethod;
        darStatus = dar.darStatus;
        darUserIndexes = dar.darUserIndexes;
        dsid = dar["dsid"];
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
  if (darStatus === null) return darNextStatusInfo;

  // Logic to work out next available status.
  // For documents in create status additional work is needed
  // to check darusers, darcriteria and dars
  if (darStatus === DarStatus.create) {
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
          darMethod === DarMethod.Process &&
          darUserIndexes.isEvaluator &&
          darUserIndexes.isEvaluator.length > 0
        )
          isUserReady = true;
        if (
          darMethod === DarMethod.Vote &&
          darUserIndexes.isVoter &&
          darUserIndexes.isVoter.length > 0
        )
          isUserReady = true;
        if (
          darMethod === DarMethod.Hybrid &&
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
      if (darMethod === DarMethod.Vote) {
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

  if (darStatus === DarStatus.vote)
    darNextStatusInfo.nextDarStatus = DarStatus.confirm;

  if (darStatus === DarStatus.evaluate) {
    if (darMethod === DarMethod.Hybrid) {
      darNextStatusInfo.nextDarStatus = DarStatus.vote;
    } else {
      darNextStatusInfo.nextDarStatus = DarStatus.confirm;
    }
  }

  if (darStatus === DarStatus.confirm)
    darNextStatusInfo.nextDarStatus = DarStatus.closed;

  // Check for nextDarStatus = confirm that a solution is chosen
  if (
    darNextStatusInfo.nextDarStatus === DarStatus.confirm &&
    (!dsid || dsid === "")
  ) {
    darNextStatusInfo.nextDarStatus = null;
    darNextStatusInfo.nextDarStatusExplanation =
      "DAR document can not be confirmed until a solution is selected by the owner";
  }

  return darNextStatusInfo;
}

//********** Database Triggers that drive nextStatus updates*/
// Update when dar is updated, a darSolutions write, or a darcriteria write
// Note: darUsers already trigger a dar update so no additional trigger needed

export const OnUpdateDarNextStatus = functions.firestore
  .document("dars/{did}")
  .onUpdate(async (snap, context) => {
    const darGetNextStatusInfo = await onGetNextDarStatus(context.params.did);
    console.log(context.params.did, " - ", darGetNextStatusInfo);
    const deepEqual = require("deep-equal");

    const after = snap.after.data();

    // Exit without updating if no changes (stop update loops)
    if (after) {
      console.log("after.DarNextStatusInfo", after.darNextStatusInfo);
      console.log("darGetNextStatusInfo", darGetNextStatusInfo);
      if (deepEqual(after.darNextStatusInfo, darGetNextStatusInfo)) {
        console.log("Matching - no update!");
        return null;
      }
    }
    console.log("Updating DAR DarNextStatusInfo");
    return snap.after.ref.set(
      {
        darNextStatusInfo: darGetNextStatusInfo
      },
      { merge: true }
    );
  });

export const OnWriteDarCriteriaNextStatus = functions.firestore
  .document("dars/{did}/darCriteria/{dcid}")
  .onWrite(async (snap, context) => {
    const darRef = snap.before.ref.parent.parent;
    const after = snap.after.data();
    const darGetNextStatusInfo = await onGetNextDarStatus(context.params.did);
    const deepEqual = require("deep-equal");

    console.log(context.params.did, " - ", darGetNextStatusInfo);

    // No need to update if no changes
    if (after) {
      console.log("after.DarNextStatusInfo", after.darNextStatusInfo);
      console.log("darGetNextStatusInfo", darGetNextStatusInfo);
      if (deepEqual(after.darNextStatusInfo, darGetNextStatusInfo)) {
        console.log("Matching - no update!");
        return null;
      }
    }
    console.log("Updating DAR");
    if (darRef) {
      return darRef.set(
        {
          darNextStatusInfo: darGetNextStatusInfo
        },
        { merge: true }
      );
    }
    return null;
  });

export const OnWriteDarSolutionsNextStatus = functions.firestore
  .document("dars/{did}/darSolutions/{dsid}")
  .onWrite(async (snap, context) => {
    const darRef = snap.before.ref.parent.parent;
    const after = snap.after.data();
    const darGetNextStatusInfo = await onGetNextDarStatus(context.params.did);
    const deepEqual = require("deep-equal");

    console.log(context.params.did, " - ", darGetNextStatusInfo);

    // No need to update if no changes
    if (after) {
      console.log("after.DarNextStatusInfo", after.darNextStatusInfo);
      console.log("darGetNextStatusInfo", darGetNextStatusInfo);
      if (deepEqual(after.darNextStatusInfo, darGetNextStatusInfo)) {
        console.log("Matching - no update!");
        return null;
      }
    }
    console.log("Updating DAR");
    if (darRef) {
      return darRef.set(
        {
          darNextStatusInfo: darGetNextStatusInfo
        },
        { merge: true }
      );
    }
    return null;
  });
