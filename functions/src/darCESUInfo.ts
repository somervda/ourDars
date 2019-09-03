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
}

// *******  HTTP Tester ****

export const getDarCESUInfo = functions.https.onRequest(
  async (request, response) => {
    // Use to test the onGetNextDarStatus function
    // https://us-central1-ourdars-7b9e2.cloudfunctions.net/getDarCESUInfo/s32tXhTTmAO3OiCgkpVK
    console.log("request.params", request.params["0"]);
    let pathParam = request.params["0"];
    if (pathParam.slice(0, 1) === "/") pathParam = pathParam.substr(1);
    let x: DarCESUInfo;

    x = await onGetDarCESUInfo(pathParam);
    console.log("x:", x);
    response.send(
      "Version:1.00,   DocId:" +
        pathParam +
        ", " +
        x.solutionCount +
        ", " +
        x.criteriaCount +
        ", " +
        x.evaluationCount +
        ", " +
        x.evaluatorCount +
        ", " +
        x.voterCount +
        ", " +
        x.stakeholderCount
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
      console.log("snaps", snaps);
    })
    .catch(function(error: any) {
      console.error("Error getting darEvaluations:", error);
    });

  return darCESUInfo;
}
