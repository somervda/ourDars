import * as functions from "firebase-functions";
import { db } from "./init";

export const onCreateDarUser = functions.firestore
  .document("dars/{did}/darUsers/{duid}")
  .onCreate(async (snap, context) => {
    console.log("Running onCreateDarUser trigger ...");

    return darUserTransaction(snap, context, "C");
  });

// export const onDeleteLesson = functions.firestore
//   .document("courses/{courseId}/lessons/{lessonId}")
//   .onDelete(async (snap, context) => {
//     console.log("Running onDeleteLesson trigger ...");

//     return courseTransaction(snap, course => {
//       return { lessonsCount: course.lessonsCount - 1 };
//     });
//   });

function darUserTransaction(
  snap: FirebaseFirestore.DocumentSnapshot,
  context: functions.EventContext,
  darUserAction: string
) {
  return db.runTransaction(async (transaction: any) => {
    const darRef = snap.ref.parent.parent;

    const darSnap = await transaction.get(darRef);

    const darUserIndexes = darSnap.data().darUserIndexes;

    // const changes = darUserIndexes["isDarUser"].push("hi");
    console.log("darUserTransaction", darUserIndexes);

    // transaction.update(darRef, changes);
  });
}
