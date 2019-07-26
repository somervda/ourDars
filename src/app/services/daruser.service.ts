import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Daruser } from '../models/daruser.model';
import { map } from 'rxjs/operators';
import { convertSnap, convertSnaps, dbFieldUpdate } from './db-utils';

@Injectable({
  providedIn: 'root'
})
export class DaruserService  {
  constructor(private afs: AngularFirestore) {}

  findById(did: string, duid: string): Observable<Daruser> {
    // console.log("Daruserservice findById"," did:",did," duid:",duid);
    const docLocation = "/dars/" + did + "/darUsers/" + duid;
    // console.log("Daruserservice findById",docLocation);
    return this.afs
      .doc(docLocation)
      .snapshotChanges()
      .pipe(
        map(snap => {
          return convertSnap<Daruser>(snap);
        })
      );
  }

  findAllDaruser(did: string, pageSize): Observable<Daruser[]> {
    // console.log("findDaruser", did,  pageSize);
    return this.afs
      .collection("dars")
      .doc(did)
      .collection("darUsers", ref => ref.limit(pageSize))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          console.log("findDarusers", convertSnaps<Daruser>(snaps));
          return convertSnaps<Daruser>(snaps);
        })
      );
  }

  fieldUpdate(did: string, duid: string, fieldName: string, newValue: any) {
    // console.log("Daruser field update",did,dsid);
    if (did && duid && fieldName) {
      const docLocation = "/dars/" + did + "/darUsers/" + duid;
      const updateObject = {};
      dbFieldUpdate(docLocation, fieldName, newValue, this.afs);
    }
  }

  createDaruser(
    did: string,
    duid: string,
    Daruser: Daruser
  ): Promise<void> {
    // console.log("createDaruser",did,Daruser);
    return this.afs
      .collection("/dars/" + did + "/darUsers/")
      .doc(duid)
      .set(Daruser);
  }

  deleteDaruser(did: string, duid: string): Promise<void> {
    return this.afs
      .collection("/dars/" + did + "/darUsers/")
      .doc(duid)
      .delete();
  }
}