import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Darevaluation } from "../models/darevaluation.model";
import { convertSnaps } from "./db-utils";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DarevaluationService {
  constructor(private afs: AngularFirestore) {}

  findById(
    did: string,
    dsid: string,
    dcid: string
  ): Observable<Darevaluation[]> {
    console.log(
      "DarevaluationService findById",
      " did:",
      did,
      " dsid:",
      dsid,
      "dcid:",
      dcid
    );

    return this.afs
      .collection("dars")
      .doc(did)
      .collection("darSolutions")
      .doc(dsid)
      .collection("darEvaluations", ref => ref.where("dcid", "==", dcid))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          console.log(
            "DarevaluationService",
            convertSnaps<Darevaluation>(snaps)
          );
          return convertSnaps<Darevaluation>(snaps);
        })
      );
  }
}
