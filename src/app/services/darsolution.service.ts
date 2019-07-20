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
    // console.log("darsoluionservice findById"," did:",did," dsid:",dsid);
    const docLocation = "/dars/" + did + "/darSolutions/" + dsid;
    console.log("darsoluionservice findById",docLocation);
    return this.afs
      .doc(docLocation)
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
    console.log("darsolution field update",did,dsid);
    if (did && dsid && fieldName) {
      const docLocation = "/dars/" + did + "/darSolutions/" + dsid;
      const updateObject = {};
      dbFieldUpdate(docLocation, fieldName, newValue, this.afs);
    }
  }

  createDarsolution(did: string, darsolution: Darsolution): Promise<DocumentReference> {
    console.log("createDarsolution",did,darsolution);
    return this.afs.collection("/dars/" + did + "/darSolutions/").add(darsolution);
  }

  deleteDarsolution(did:string, dsid: string): Promise<void> {
    return this.afs
      .collection("/dars/" + did + "/darSolutions/")
      .doc(dsid)
      .delete();
  }
}
