import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onGetNextDarStatus } from "./darStatus";

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

export const getNextDarStatus = functions.https.onRequest(
  async (request, response) => {
    // Use to test the onGetNextDarStatus function
    console.log("request.params", request.params["0"]);
    let pathParam = <string>request.params["0"];
    if (pathParam.slice(0, 1) == "/") pathParam = pathParam.substr(1);
    let x;

    x = await onGetNextDarStatus(pathParam);

    response.send(pathParam + "-" + x.darStatus);
  }
);

export {
  onCreateDarUser,
  onDeleteDarUser,
  onUpdateDarUser
} from "./darUsersIndex";

export { onCreateDarEvaluations } from "./darEvaluations";
