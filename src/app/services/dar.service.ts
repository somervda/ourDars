import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Dar } from "../models/dar.model";
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
    console.log("findDars", sortField, sortOrder, pageSize);
    return this.afs
      .collection("dars", ref =>
        ref.orderBy(sortField, sortOrder).limit(pageSize)
      )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          console.log("findDars", convertSnaps<Dar>(snaps));
          return convertSnaps<Dar>(snaps);
        }),
        first()
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
