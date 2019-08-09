import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const onCreateDarEvaluations = functions.firestore
  .document("dars/{did}/darSolutions/{dsid}/darEvaluations/{dcid}")
  .onCreate(async (snap, context) => {
    return snap.ref.set(
      {
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        dar: context.params["did"],
        dsid: context.params["dsid"]
      },
      { merge: true }
    );
  });
