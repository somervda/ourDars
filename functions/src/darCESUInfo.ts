// import { DarMethod, DarStatus } from "./models";
import * as functions from "firebase-functions";
import { db } from "./init";

export interface DarCESUInfo {
  solutionCount: number;
  criteriaCount: number;
  evaluationCount: number;
  evaluatorCount: number;
  voterCount: number;
  stakeholderCount: number;
  confirmedCount: number;
  voteCount: number;
}

// *******  HTTP Tester ****

export const getDarCESUInfo = functions.https.onRequest(
  async (request, response) => {
    // Use to test the onGetNextDarStatus function
    // https://us-central1-ourdars-7b9e2.cloudfunctions.net/getDarCESUInfo/umTx4UuvqHpvWOeO9Xc5
    console.log("request.params", request.params["0"]);
    let pathParam = request.params["0"];
    if (pathParam.slice(0, 1) === "/") pathParam = pathParam.substr(1);
    let x: DarCESUInfo;

    x = await onGetDarCESUInfo(pathParam);
    console.log("x:", x);
    response.send(
      "Version:1.00,   DocId:" +
        pathParam +
        ", solutionCount:" +
        x.solutionCount +
        ", criteriaCount:" +
        x.criteriaCount +
        ", evaluationCount" +
        x.evaluationCount +
        ", evaluatorCount:" +
        x.evaluatorCount +
        ", voterCount:" +
        x.voterCount +
        ", stakeholderCount:" +
        x.stakeholderCount +
        ", confirmedCount:" +
        x.confirmedCount +
        ", voteCount:" +
        x.voteCount
    );
  }
);

// **** Supporting functions *

export async function onGetDarCESUInfo(did: string): Promise<DarCESUInfo> {
  // Will return  information about the sub collections (Criteria,Evaluation,Solutions )
  let darCESUInfo = {} as DarCESUInfo;

  console.log("onGetDarCESUInfo did", did);
  const docRef = <FirebaseFirestore.DocumentReference>(
    db.collection("dars").doc(did)
  );

  await docRef
    .get()
    .then(function(doc: any) {
      if (doc.exists) {
        darCESUInfo.evaluatorCount = doc.data().darUserIndexes.isEvaluator.length;
        darCESUInfo.stakeholderCount = doc.data().darUserIndexes.isStakeholder.length;
        darCESUInfo.voterCount = doc.data().darUserIndexes.isVoter.length;
      } else {
        // doc.data() will be undefined in this case
        console.error("No dar doc document!", did);
        darCESUInfo.evaluatorCount = 0;
        darCESUInfo.stakeholderCount = 0;
        darCESUInfo.voterCount = 0;
      }
    })
    .catch(function(error: any) {
      console.error("Error getting document:", error, did);
      darCESUInfo.evaluatorCount = 0;
      darCESUInfo.stakeholderCount = 0;
      darCESUInfo.voterCount = 0;
    });

  // Get UserCounts
  const userRef = <FirebaseFirestore.CollectionReference>db
    .collection("dars")
    .doc(did)
    .collection("darUsers");
  await userRef
    .get()
    .then(snaps => {
      // (darCESUInfo.criteriaCount = snaps.docs.length)
      darCESUInfo.confirmedCount = snaps.docs.filter(
        d => d.data().confirmed == true
      ).length;
      darCESUInfo.voteCount = snaps.docs.filter(
        d => d.data().solutionVote.dsid != ""
      ).length;
    })
    .catch(function(error: any) {
      console.error("Error getting darUsers:", error);
    });

  // Get criteriaCount
  const criteriaRef = <FirebaseFirestore.CollectionReference>db
    .collection("dars")
    .doc(did)
    .collection("darCriteria");
  await criteriaRef
    .get()
    .then(snaps => (darCESUInfo.criteriaCount = snaps.docs.length))
    .catch(function(error: any) {
      console.error("Error getting darCriteria:", error);
    });

  // get solutionCount
  const solutionRef = <FirebaseFirestore.CollectionReference>db
    .collection("dars")
    .doc(did)
    .collection("darSolutions");
  await solutionRef
    .get()
    .then(snaps => (darCESUInfo.solutionCount = snaps.docs.length))
    .catch(function(error: any) {
      console.error("Error getting darSolutions:", error);
    });

  // get evaluationCount
  const evaluationRef = <FirebaseFirestore.CollectionReference>(
    db.collectionGroup("darEvaluations").where("did", "==", did)
  );
  await evaluationRef
    .get()
    .then(snaps => {
      darCESUInfo.evaluationCount = snaps.docs.length;
    })
    .catch(function(error: any) {
      console.error("Error getting darEvaluations:", error);
    });

  return darCESUInfo;
}

//********** Database Triggers that drive nextStatus updates*/
// Update when dar is updated, a darSolutions write, or a darcriteria write
// Note: darUsers already trigger a dar update so no additional trigger needed

export const OnUpdateDarCESUInfo = functions.firestore
  .document("dars/{did}")
  .onUpdate(async (snap, context) => {
    const darCESUInfo = await onGetDarCESUInfo(context.params.did);
    console.log(context.params.did, " - ", darCESUInfo);
    const deepEqual = require("deep-equal");

    const after = snap.after.data();

    // Exit without updating if no changes (stop update loops)
    if (after) {
      console.log("after.darCESUInfo", after.darCESUInfo);
      console.log("darCESUInfo", darCESUInfo);
      if (deepEqual(after.darCESUInfo, darCESUInfo)) {
        console.log("Matching - no update!");
        return null;
      }
    }
    console.log("Updating DAR darCESUInfo");
    return snap.after.ref.update({
      darCESUInfo: darCESUInfo
    });
  });

export const OnWriteDarSolutionsDarCESUInfo = functions.firestore
  .document("dars/{did}/darSolutions/{dsid}")
  .onWrite(async (snap, context) => {
    if (snap.before.exists && snap.after.exists) {
      console.log("Exiting, updates do not change solutionCounts");
      return null;
    }
    const darRef = snap.before.ref.parent.parent;
    const darCESUInfo = await onGetDarCESUInfo(context.params.did);

    if (darRef) {
      return darRef.update({
        darCESUInfo: darCESUInfo
      });
    }
    return null;
  });

export const OnWriteDarCriteriaDarCESUInfo = functions.firestore
  .document("dars/{did}/darCriteria/{dcid}")
  .onWrite(async (snap, context) => {
    if (snap.before.exists && snap.after.exists) {
      console.log("Exiting, updates do not change criteriaCounts");
      return null;
    }
    const darRef = snap.before.ref.parent.parent;
    const darCESUInfo = await onGetDarCESUInfo(context.params.did);
    if (darRef) {
      return darRef.update({
        darCESUInfo: darCESUInfo
      });
    }
    return null;
  });

export const OnWriteDarUsersDarCESUInfo = functions.firestore
  .document("dars/{did}/darUsers/{duid}")
  .onWrite(async (snap, context) => {
    const darRef = snap.before.ref.parent.parent;
    const darCESUInfo = await onGetDarCESUInfo(context.params.did);
    if (darRef) {
      return darRef.update({
        darCESUInfo: darCESUInfo
      });
    }
    return null;
  });

export const OnWriteDarEvaluationsDarCESUInfo = functions.firestore
  .document("dars/{did}/darSolutions/{dsid}/darEvaluations/{dcid}")
  .onWrite(async (snap, context) => {
    if (snap.before.exists && snap.after.exists) {
      console.log("Exiting, updates do not change evaluationCounts");
      return null;
    }
    const darRef = <FirebaseFirestore.DocumentReference>(
      db.collection("dars").doc(context.params.did)
    );
    const darCESUInfo = await onGetDarCESUInfo(context.params.did);
    if (darRef) {
      return darRef.update({
        darCESUInfo: darCESUInfo
      });
    }
    return null;
  });
