import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as models from "./models";

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

exports.darsDateClosed = functions.firestore
  .document("dars/{did}")
  .onUpdate((snap, context) => {
    const after = snap.after.data();
    const before = snap.before.data();
    console.log("darsDateClosed before:", before, " after:", after);
    if (before && after && before.darStatus == after.darStatus) return null;
    if (after && after.darStatus == models.DarStatus.closed) {
      // Update dateClosed
      console.log("darsDateClosed set date");
      return snap.after.ref.set(
        {
          dateClosed: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    } else {
      // reset date closed
      console.log("darsDateClosed reset date");
      return snap.after.ref.update({
        dateClosed: admin.firestore.FieldValue.delete()
      });
    }
  });

export {
  onCreateDarUser,
  onDeleteDarUser,
  onUpdateDarUser
} from "./darUsersIndex";

export { onCreateDarEvaluations } from "./darEvaluations";

export {
  getDarCESUInfo,
  onGetDarCESUInfo,
  OnUpdateDarCESUInfo,
  OnWriteDarSolutionsDarCESUInfo,
  OnWriteDarEvaluationsDarCESUInfo,
  OnWriteDarUsersDarCESUInfo,
  OnWriteDarCriteriaDarCESUInfo
} from "./darCESUInfo";
