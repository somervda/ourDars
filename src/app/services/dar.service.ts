import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Dar, DarStatus } from "../models/dar.model";
import { Observable } from "rxjs";
import { map, first } from "rxjs/operators";
import { convertSnaps, dbFieldUpdate, convertSnap } from "./db-utils";
import OrderByDirection = firebase.firestore.OrderByDirection;

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

  findDars(
    filter = "",
    sortField,
    sortOrder: OrderByDirection,
    pageSize
  ): Observable<Dar[]> {
    // console.log("findDars", sortField, sortOrder, pageSize);
    return this.afs
      .collection("dars", ref =>
        ref.orderBy(sortField, sortOrder).limit(pageSize)
      )
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
}
