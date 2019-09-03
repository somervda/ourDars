import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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

export {
  onCreateDarUser,
  onDeleteDarUser,
  onUpdateDarUser
} from "./darUsersIndex";

export { onCreateDarEvaluations } from "./darEvaluations";

export {
  getNextDarStatus,
  OnUpdateDarNextStatus,
  OnWriteDarCriteriaNextStatus,
  OnWriteDarSolutionsNextStatus
} from "./darNextStatus";

export { getDarCESUInfo, onGetDarCESUInfo } from "./darCESUInfo";
