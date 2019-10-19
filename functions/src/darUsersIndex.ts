import * as functions from "firebase-functions";
import { db } from "./init";

export const onCreateDarUser = functions.firestore
  .document("dars/{did}/darUsers/{duid}")
  .onCreate(async (snap, context) => {
    // console.log("Running onCreateDarUser trigger ...");
    return darUserTransaction(snap, context, "C");
  });

export const onDeleteDarUser = functions.firestore
  .document("dars/{did}/darUsers/{duid}")
  .onDelete(async (snap, context) => {
    // console.log("Running onDeleteDarUser trigger ...");
    return darUserTransaction(snap, context, "D");
  });

export const onUpdateDarUser = functions.firestore
  .document("dars/{did}/darUsers/{duid}")
  .onUpdate(async (snap, context) => {
    // console.log("Running onUpdateDarUser trigger ...");
    return darUserTransaction(snap.after, context, "U");
  });

// supporting functions

function darUserTransaction(
  snap: FirebaseFirestore.DocumentSnapshot,
  context: functions.EventContext,
  darUserAction: string
) {
  return db.runTransaction(async (transaction: any) => {
    const darUser = snap.data();
    const isOwner = darUser ? darUser.isOwner : false;
    const isStakeholder = darUser ? darUser.isStakeholder : false;
    const isEvaluator = darUser ? darUser.isEvaluator : false;
    const isVoter = darUser ? darUser.isVoter : false;
    const isReader = darUser ? darUser.isReader : false;
    const darRef = snap.ref.parent.parent;

    const darSnap = await transaction.get(darRef);

    let darUserIndexes = cleanupDarUserIndexes(darSnap.data().darUserIndexes);

    if (darUserAction === "C" || darUserAction === "U")
      darUserIndexes = updateDarUser(
        darUserIndexes,
        context.params.duid,
        isOwner,
        isStakeholder,
        isEvaluator,
        isVoter,
        isReader
      );

    if (darUserAction === "D")
      darUserIndexes = updateDarUser(
        darUserIndexes,
        context.params.duid,
        false,
        false,
        false,
        false,
        false
      );

    console.log("darUserTransaction", darUserIndexes);

    console.log("* Updating DAR darUserIndexes");
    transaction.update(darRef, { darUserIndexes: darUserIndexes });
  });
}

function cleanupDarUserIndexes(darUserIndexes: any): any {
  // Update the current darUserIndexes structure to make
  // sure the main properties are set up
  let dui = darUserIndexes;
  // darUserIndexes undefined, initialize whole thing
  if (!dui)
    dui = {
      isDarUser: [],
      isOwner: [],
      isStakeholder: [],
      isEvaluator: [],
      isReader: [],
      isVoter: []
    };
  // Check each darUser array is present
  if (!dui["isDarUser"]) dui["isDarUser"] = [];
  if (!dui["isOwner"]) dui["isOwner"] = [];
  if (!dui["isStakeholder"]) dui["isStakeholder"] = [];
  if (!dui["isEvaluator"]) dui["isEvaluator"] = [];
  if (!dui["isVoter"]) dui["isVoter"] = [];
  if (!dui["isReader"]) dui["isReader"] = [];
  return dui;
}

function updateDarUser(
  darUserIndexes: any,
  uid: string,
  isOwner: boolean,
  isStakeholder: boolean,
  isEvaluator: boolean,
  isVoter: boolean,
  isReader: boolean
): any {
  // Adds the uid of the user to the role arrays (prevent duplicates)
  const dui = darUserIndexes;
  const hasRole =
    isOwner || isStakeholder || isEvaluator || isVoter || isReader;

  if (!dui.isDarUser.includes(uid) && hasRole) dui.isDarUser.push(uid);
  if (dui.isDarUser.includes(uid) && !hasRole)
    dui.isDarUser.splice(dui.isDarUser.indexOf(uid), 1);

  if (!dui.isOwner.includes(uid) && isOwner) dui.isOwner.push(uid);
  if (dui.isOwner.includes(uid) && !isOwner)
    dui.isOwner.splice(dui.isOwner.indexOf(uid), 1);

  if (!dui.isStakeholder.includes(uid) && isStakeholder)
    dui.isStakeholder.push(uid);
  if (dui.isStakeholder.includes(uid) && !isStakeholder)
    dui.isStakeholder.splice(dui.isStakeholder.indexOf(uid), 1);

  if (!dui.isEvaluator.includes(uid) && isEvaluator) dui.isEvaluator.push(uid);
  if (dui.isEvaluator.includes(uid) && !isEvaluator)
    dui.isEvaluator.splice(dui.isEvaluator.indexOf(uid), 1);

  if (!dui.isVoter.includes(uid) && isVoter) dui.isVoter.push(uid);
  if (dui.isVoter.includes(uid) && !isVoter)
    dui.isVoter.splice(dui.isReader.indexOf(uid), 1);

  if (!dui.isReader.includes(uid) && isReader) dui.isReader.push(uid);
  if (dui.isReader.includes(uid) && !isReader)
    dui.isReader.splice(dui.isOwner.indexOf(uid), 1);

  return dui;
}
