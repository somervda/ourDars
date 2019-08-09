import { Darevaluation } from "./../models/darevaluation.model";
import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { convertSnap, convertSnaps } from "./db-utils";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DarevaluationService {
  constructor(private afs: AngularFirestore) {}

  findById(did: string, dsid: string, dcid: string): Observable<Darevaluation> {
    console.log(
      "DarevaluationService findById",
      " did:",
      did,
      " dsid:",
      dsid,
      "dcid:",
      dcid
    );
    const docLocation =
      "/dars/" + did + "/darSolutions/" + dsid + "/darEvaluations/" + dcid;
    console.log("DarevaluationService docLocation", docLocation);

    return this.afs
      .doc(docLocation)
      .snapshotChanges()
      .pipe(
        map(snap => {
          return convertSnap<Darevaluation>(snap);
        })
      );
  }

  setEvaluation(
    did: string,
    dsid: string,
    dcid: string,
    darevaluation: Darevaluation
  ): Promise<void> {
    console.log("updateEvaluation", did, dsid, dcid, darevaluation);

    return this.afs
      .collection("dars")
      .doc(did)
      .collection("darSolutions")
      .doc(dsid)
      .collection("darEvaluations")
      .doc(dcid)
      .set(darevaluation);
  }

  findAllForDar(did: string): Observable<Darevaluation[]> {
    console.log("findAllForDar ", did);
    return  this.afs.collectionGroup('darEvaluations', ref => ref.where('did', '==', did))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          console.log("findDarcriteria", convertSnaps<Darevaluation>(snaps));
          return convertSnaps<Darevaluation>(snaps);
        })
      );
  }
}
