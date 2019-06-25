import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Team } from "../models/team.model";
import { convertSnaps } from "./db-utils";
import { first, map } from "rxjs/operators";
import OrderByDirection = firebase.firestore.OrderByDirection;
import * as firebase from "firebase";

@Injectable({
  providedIn: "root"
})
export class TeamService {
  constructor(private afs: AngularFirestore) {}

  findTeamById(id: string): Observable<Team> {
    return this.afs
      .collection("teams", ref =>
        // use firebase.firestore.FieldPath.documentId() to get a collection of a single document
        // based on the document id
        ref.where(firebase.firestore.FieldPath.documentId(), "==", id)
      )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const teams = convertSnaps<Team>(snaps);
          return teams.length == 1 ? teams[0] : undefined;
        }),
        first()
      );
  }

  findTeams(
    filter = "",
    sortField,
    sortOrder: OrderByDirection,
    pageSize
  ): Observable<Team[]> {
    // console.log("findTeams", sortField, sortOrder, pageSize);
    return this.afs
      .collection("teams", ref =>
        ref.orderBy(sortField, sortOrder).limit(pageSize)
      )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          // console.log("findTeams", convertSnaps<Team>(snaps));
          return convertSnaps<Team>(snaps);
        })
      );
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any) {
    if (docId && fieldName) {
      const updateObject = {};
      console.log("dbFieldUpdate", docId, fieldName, newValue);
      updateObject[fieldName] = newValue;
      this.afs
        .doc("/teams/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          // console.log(fieldName + " updated");
        })
        .catch(error =>
          console.error(fieldName + " team update error ", error)
        );
    }
  }
}
