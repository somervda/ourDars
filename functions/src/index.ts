import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onGetNextDarStatus, DarNextStatusInfo } from "./darStatus";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });

exports.usersDateCreated = functions.firestore
  .document("users/{uid}")
  .onCreate((snap, context) => {
    return snap.ref.set(
      {
        dateCreated: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  });

exports.darsDateCreated = functions.firestore
  .document("dars/{did}")
  .onCreate((snap, context) => {
    return snap.ref.set(
      {
        dateCreated: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  });

exports.darsNextStatusOnUpdate = functions.firestore
  .document("dars/{did}")
  .onUpdate(async (snap, context) => {
    const afterDarGetNextStatusInfo = await onGetNextDarStatus(
      context.params.did
    );
    console.log(context.params.did, " - ", afterDarGetNextStatusInfo);

    const after = snap.after.data();

    if (after) {
      console.log(
        "after.DarNextStatusInfo === afterDarGetNextStatusInfo",
        afterDarGetNextStatusInfo,
        after.DarNextStatusInfo
      );
      if (after.DarNextStatusInfo === afterDarGetNextStatusInfo) {
        console.log("Matching!");
        return null;
      }
    }
    console.log("Updating DAR");
    return snap.after.ref.set(
      {
        DarNextStatusInfo: afterDarGetNextStatusInfo
      },
      { merge: true }
    );
  });

export const getNextDarStatus = functions.https.onRequest(
  async (request, response) => {
    // Use to test the onGetNextDarStatus function
    // https://us-central1-ourdars-7b9e2.cloudfunctions.net/getNextDarStatus/s32tXhTTmAO3OiCgkpVK
    console.log("request.params", request.params["0"]);
    let pathParam = <string>request.params["0"];
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

export {
  onCreateDarUser,
  onDeleteDarUser,
  onUpdateDarUser
} from "./darUsersIndex";

export { onCreateDarEvaluations } from "./darEvaluations";
