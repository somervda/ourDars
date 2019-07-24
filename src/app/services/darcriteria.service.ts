import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Darcriteria } from '../models/darcriteria.model';
import { map } from 'rxjs/operators';
import { convertSnap, convertSnaps, dbFieldUpdate } from './db-utils';

@Injectable({
  providedIn: 'root'
})
export class DarcriteriaService {


  constructor(private afs: AngularFirestore) {}

  findById(did: string,dcid : string): Observable<Darcriteria> {
    // console.log("darcriteriaservice findById"," did:",did," dsid:",dsid);
    const docLocation = "/dars/" + did + "/Darcriterias/" + dcid;
    // console.log("darcriteriaservice findById",docLocation);
    return this.afs
      .doc(docLocation)
      .snapshotChanges()
      .pipe(
        map(snap => {
          return convertSnap<Darcriteria>(snap);
        })
      );
  }

  findAllDarcriterias(
    did : string,
    pageSize
  ): Observable<Darcriteria[]> {
    // console.log("findDarcriteria", did,  pageSize);
    return this.afs
    .collection("dars").doc(did).collection("darCriteria", ref =>
      ref.limit(pageSize)
  )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          // console.log("findDarcriteria", convertSnaps<Darcriteria>(snaps));
          return convertSnaps<Darcriteria>(snaps);
        })
      );
  }

  fieldUpdate(did: string ,dcid: string, fieldName: string, newValue: any) {
    // console.log("Darcriteria field update",did,dsid);
    if (did && dcid && fieldName) {
      const docLocation = "/dars/" + did + "/darCriteria/" + dcid;
      const updateObject = {};
      dbFieldUpdate(docLocation, fieldName, newValue, this.afs);
    }
  }

  createDarcriteria(did: string, darcriteria: Darcriteria): Promise<DocumentReference> {
    // console.log("createDarcriteria",did,Darcriteria);
    return this.afs.collection("/dars/" + did + "/darCriteria/").add(darcriteria);
  }

  deleteDarcriteria(did:string, dcid: string): Promise<void> {
    return this.afs
      .collection("/dars/" + did + "/darCriteria/")
      .doc(dcid)
      .delete();
  }
}
