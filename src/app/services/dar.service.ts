import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Dar, DarStatus, DarMethod, DarNextStatus } from "../models/dar.model";
import { Observable } from "rxjs";
import { map, first } from "rxjs/operators";
import { convertSnaps, dbFieldUpdate, convertSnap } from "./db-utils";

@Injectable({
  providedIn: "root"
})
export class DarService {
  constructor(private afs: AngularFirestore) {}

  findById(id: string): Observable<Dar> {
    return this.afs
      .doc("/dars/" + id)
      .snapshotChanges()
      .pipe(
        map(snap => {
          return convertSnap<Dar>(snap);
        })
      );
  }

  findAllDars(
    title: string,
    status: DarStatus,
    pageSize: number
  ): Observable<Dar[]> {
    console.log("findAllDars", title, status, pageSize);
    return this.afs
      .collection("dars", ref => {
        let retVal = ref as any;
        if (title != "") {
          retVal = retVal.where("title", ">=", title);
          retVal = retVal.where("title", "<=", title + "z");
        }
        if (status) {
          retVal = retVal.where("darStatus", "==", status);
        }

        retVal = retVal.orderBy("title");

        retVal = retVal.limit(pageSize);
        return retVal;
      })
      .snapshotChanges()
      .pipe(
        map(snaps => {
          // console.log("findDars", convertSnaps<Dar>(snaps));
          return convertSnaps<Dar>(snaps);
        }),
        first()
      );
  }

  findMyDars(
    uid: string,
    uidMatchOn: string,
    status: DarStatus,
    pageSize: number
  ): Observable<Dar[]> {
    // console.log("findMyDars", uid, "#" + uidMatchOn + "#", status);
    return this.afs
      .collection("dars", ref => {
        // Add where, order, and limits
        let retVal = ref as any;

        if (uidMatchOn == "")
          retVal = retVal.where(
            "darUserIndexes.isDarUser",
            "array-contains",
            uid
          );
        if (uidMatchOn == "owner")
          retVal = retVal.where(
            "darUserIndexes.isOwner",
            "array-contains",
            uid
          );
        if (uidMatchOn == "stakeholder")
          retVal = retVal.where(
            "darUserIndexes.isStakeholder",
            "array-contains",
            uid
          );
        if (uidMatchOn == "evaluator")
          retVal = retVal.where(
            "darUserIndexes.isEvaluator",
            "array-contains",
            uid
          );
        if (uidMatchOn == "voter")
          retVal = retVal.where(
            "darUserIndexes.isVoter",
            "array-contains",
            uid
          );
        if (uidMatchOn == "reader")
          retVal = retVal.where(
            "darUserIndexes.isReader",
            "array-contains",
            uid
          );

        if (status) {
          retVal = retVal.where("darStatus", "==", status);
          retVal = retVal.orderBy("title");
        } else {
          // Don't show closed or deleted dars on MyDars by default
          retVal = retVal.where("darStatus", "<", DarStatus.closed);
          retVal = retVal.orderBy("darStatus").orderBy("title");
        }

        retVal = retVal.limit(pageSize);
        return retVal;
      })
      .snapshotChanges()
      .pipe(
        map(snaps => {
          // console.log("findDars", convertSnaps<Dar>(snaps));
          return convertSnaps<Dar>(snaps);
        })
      );
  }

  fieldUpdate(docId: string, fieldName: string, newValue: any) {
    if (docId && fieldName) {
      const updateObject = {};
      dbFieldUpdate("/dars/" + docId, fieldName, newValue, this.afs);
    }
  }

  createDar(dar: Dar): Promise<DocumentReference> {
    return this.afs.collection("dars").add(dar);
  }

  deleteDar(id: string): Promise<void> {
    return this.afs
      .collection("dars")
      .doc(id)
      .delete();
  }

  getDarNextStatus(dar: Dar): DarNextStatus {
    // Return an array of next valid owner darStatus values based on workflow
    let nextDarStatus = {} as DarNextStatus;
    nextDarStatus.darStatus = [];
    // DEsign
    if (dar.darStatus === DarStatus.design) {
      const createComplete = this.isDesignComplete(dar);
      if (createComplete.isComplete) {
        // Populate the next statuses
        if (dar.darMethod === DarMethod.Vote) {
          nextDarStatus.darStatus = [DarStatus.vote];
        } else nextDarStatus.darStatus = [DarStatus.evaluate];
      } else {
        nextDarStatus.comment = createComplete.comment;
        nextDarStatus.explanation = createComplete.explanation;
      }
    }

    // Vote
    if (dar.darStatus === DarStatus.vote) {
      const isConfirmReady = this.isConfirmReady(dar);
      if (isConfirmReady.isReady) {
        nextDarStatus.darStatus = [DarStatus.confirm, DarStatus.design];
      } else {
        nextDarStatus.comment = isConfirmReady.comment;
        nextDarStatus.explanation = isConfirmReady.explanation;
        nextDarStatus.darStatus = [DarStatus.design];
      }
    }
    // Evaluate
    if (dar.darStatus === DarStatus.evaluate) {
      if (dar.darMethod === DarMethod.Hybrid) {
        nextDarStatus.darStatus = [DarStatus.vote, , DarStatus.design];
      } else {
        const isConfirmReady = this.isConfirmReady(dar);
        if (isConfirmReady.isReady) {
          nextDarStatus.darStatus = [DarStatus.confirm, DarStatus.design];
        } else {
          nextDarStatus.comment = isConfirmReady.comment;
          nextDarStatus.explanation = isConfirmReady.explanation;
          nextDarStatus.darStatus = [DarStatus.design];
        }
      }
    }
    // Confirm
    if (dar.darStatus === DarStatus.confirm) {
      const isClosedReady = this.isClosedReady(dar);
      if (isClosedReady.isReady) {
        nextDarStatus.darStatus = [DarStatus.closed, DarStatus.design];
      } else {
        nextDarStatus.comment = isClosedReady.comment;
        nextDarStatus.explanation = isClosedReady.explanation;
        nextDarStatus.darStatus = [DarStatus.design];
      }
    }

    return nextDarStatus;
  }

  // Check that the DAR is in a state where it can move on to the next status
  isDesignComplete(
    dar: Dar
  ): { isComplete: boolean; comment: string; explanation: string } {
    let returnValue = {
      isComplete: false,
      comment: "Not ready to move from DESIGN stage.",
      explanation: ""
    };
    if (dar.darCESUInfo.stakeholderCount == 0) {
      returnValue.explanation += "At least one stakeholder is required. ";
    }
    if (dar.darCESUInfo.solutionCount < 1) {
      returnValue.explanation +=
        "At least one solution is required for any decision. ";
    }
    if (dar.darCESUInfo.criteriaCount == 0) {
      returnValue.explanation +=
        "At least one criteria is required for any decision. ";
    }
    if (
      dar.darCESUInfo.voterCount == 0 &&
      (dar.darMethod === DarMethod.Vote || dar.darMethod === DarMethod.Hybrid)
    ) {
      returnValue.explanation +=
        "At least one voter is required for decisions using VOTE or HYBRID methodology. ";
    }
    if (
      dar.darCESUInfo.evaluatorCount == 0 &&
      (dar.darMethod === DarMethod.Process ||
        dar.darMethod === DarMethod.Hybrid)
    ) {
      returnValue.explanation +=
        "At least one evaluator is required for decisions using PROCESS or HYBRID methodology. ";
    }

    if (returnValue.explanation == "") {
      returnValue.isComplete = true;
      returnValue.comment = "";
    }

    return returnValue;
  }

  // Check that the DAR is in a state where it can move on to the next status
  isConfirmReady(
    dar: Dar
  ): { isReady: boolean; comment: string; explanation: string } {
    let returnValue = {
      isReady: false,
      comment:
        "Not ready to move from the " +
        DarStatus[dar.darStatus].toUpperCase() +
        " status to the CONFIRM status.",
      explanation: ""
    };

    if (dar.dsid == "" || dar.dsid == null) {
      returnValue.explanation +=
        "A solution must entered on the DAR form before the DAR can be confirmed. ";
    }

    if (returnValue.explanation == "") {
      returnValue.isReady = true;
      returnValue.comment = "";
    }

    return returnValue;
  }

  isClosedReady(
    dar: Dar
  ): { isReady: boolean; comment: string; explanation: string } {
    let returnValue = {
      isReady: false,
      comment: "Not ready to move from CONFIRM to CLOSED status.",
      explanation: ""
    };
    // Check that all confirmations have been performed
    if (dar.darCESUInfo.stakeholderCount != dar.darCESUInfo.confirmedCount) {
      returnValue.explanation +=
        "This DAR can only be closed when all stakeholders have agreed that the DAR process; has been followed correctly, and confirmed the solution chosen for the DAR. ";
    }

    if (returnValue.explanation == "") {
      returnValue.isReady = true;
      returnValue.comment = "";
    }

    return returnValue;
  }
}
