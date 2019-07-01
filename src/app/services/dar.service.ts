import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Dar } from '../models/dar.model';
import { Observable } from "rxjs";
import { map, first } from 'rxjs/operators';
import { convertSnaps, dbFieldUpdate } from './db-utils';
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
  providedIn: 'root'
})
export class DarService {

  constructor(private afs: AngularFirestore) {}

  findDarById(id: string): Observable<Dar> {
    return this.afs
      .collection("dars", ref =>
        ref.where("__name__", "==", id)
      )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const dars = convertSnaps<Dar>(snaps);
          return dars.length == 1 ? dars[0] : undefined;
        }),
        first()
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
    return this.afs
      .collection("dars")
      .add(dar);
  }

  deleteDar(id: string): Promise<void> {
    return this.afs.collection("dars").doc(id).delete();
  }
}
