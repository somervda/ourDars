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

    let darUserIndexes = cleanupDarUserIndexes(darSnap.data().darUserIndexes);

    darUserIndexes = addDarUser(darUserIndexes,context.params.duid,["Owner"])

    // const changes = darUserIndexes["isDarUser"].push("hi");
    console.log("darUserTransaction", darUserIndexes);

     transaction.update(darRef, { darUserIndexes :  darUserIndexes });
  });
}



function cleanupDarUserIndexes(darUserIndexes:any) :any {
  // Update the current darUserIndexes structure to make
  // sure the main properties are set up
  let dui = darUserIndexes;
  // darUserIndexes undefined, initialize whole thing
  if (!dui) 
    dui = { isDarUser : [],
      isOwner: [],
      isStakeHolder: [],
      isEvaluator: [],
      isReader: [],
      isVoter: [],
    };  
  // Check each darUser array is present
  if(!dui["isDarUser"])
    dui["isDarUser"] = [];
  if(!dui["isOwner"])
    dui["isOwner"] = [];
  if(!dui["isStakeholder"])
    dui["isStakeholder"]= [];
  if(!dui["isEvaluator"])
    dui["isEvaluator"] = [];
  if(!dui["isVoter"])
    dui["isVoter"] = [];
  if(!dui["isReader"])
    dui["isReader"] = []; 
  return dui;
}

function addDarUser(darUserIndexes:any, uid: string,roles: [string]) : any {
  // Adds the uid of the user to the role arrays (prevent duplicates)
  let dui = darUserIndexes;
  if (!dui.isDarUser.includes(uid))
    dui.isDarUser.push(uid);

  return dui;
}
