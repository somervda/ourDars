import { Injectable } from '@angular/core';
import { AngularFirestore , DocumentReference} from '@angular/fire/firestore';
import { Darsolution } from '../models/darsolution.model';
import { Observable } from 'rxjs';
import { convertSnap, convertSnaps, dbFieldUpdate } from './db-utils';
import OrderByDirection = firebase.firestore.OrderByDirection;
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DarsolutionService {

  constructor(private afs: AngularFirestore) {}

  findById(did: string,dsid : string): Observable<Darsolution> {
    return this.afs
      .doc("/Dars/" + did + "/DarSolutions/" + dsid)
      .snapshotChanges()
      .pipe(
        map(snap => {
          return convertSnap<Darsolution>(snap);
        })
      );
  }

  findAllDarsolutions(
    did : string,
    pageSize
  ): Observable<Darsolution[]> {
    console.log("findDarsolutions", did,  pageSize);
    return this.afs
    .collection("dars").doc(did).collection("darSolutions", ref =>
      ref.limit(pageSize)
  )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          console.log("findDarsolutions", convertSnaps<Darsolution>(snaps));
          return convertSnaps<Darsolution>(snaps);
        })
      );
  }

  fieldUpdate(did: string ,dsid: string, fieldName: string, newValue: any) {
    if (did && dsid && fieldName) {
      const updateObject = {};
      dbFieldUpdate("/dars/" + did + "/darsolutions/" + dsid, fieldName, newValue, this.afs);
    }
  }

  createDarsolution(did: string, darsolution: Darsolution): Promise<DocumentReference> {
    return this.afs.collection("/dars/" + did + "/darsolutions/").add(darsolution);
  }

  deleteDarsolution(did:string, dsid: string): Promise<void> {
    return this.afs
      .collection("/dars/" + did + "/darsolutions/")
      .doc(dsid)
      .delete();
  }
}
