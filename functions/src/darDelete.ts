import * as functions from "firebase-functions";
import { db } from "./init";

export const onDarDelete = functions.firestore
  .document("dars/{did}")
  .onDelete(async (snap, context) => {
    const did = context.params["did"];
    console.log("Running onDarDelete trigger did:",did);

    // Delete dependent documents
    // darEvaluations
    const evaluationRef = <FirebaseFirestore.CollectionReference>(
        db.collectionGroup("darEvaluations").where("did", "==", did)
      );
      evaluationRef.get()
      .then(snapshot => {
        const docsDeleted = snapshotDelete(snapshot);
        console.log("evaluations deleted:",docsDeleted);
      })
      .catch()
  });

function snapshotDelete(snapshot: FirebaseFirestore.QuerySnapshot ): number {

    // Delete documents in a batch
    let batch = db.batch();
    snapshot.docs.forEach((doc) => {
        console.log("snapshotDelete ",doc.ref.id)
        batch.delete(doc.ref);
    });

    return batch.commit().then(() => {
        return snapshot.size;
    });
    return -1;
}

