import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const onCreateDarEvaluations = functions.firestore
  .document("dars/{did}/darSolutions/{dsid}/darEvaluations/{dcid}")
  .onCreate(async (snap, context) => {
    // Add dar id and solution id to document
    // to use in collection group query
    return snap.ref.update({
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      did: context.params["did"],
      dsid: context.params["dsid"]
    });
  });
