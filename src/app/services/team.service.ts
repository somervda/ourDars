import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Team } from "../models/team.model";
import { convertSnaps, dbFieldUpdate } from "./db-utils";
import { first, map } from "rxjs/operators";
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
  providedIn: "root"
})
export class TeamService {
  constructor(private afs: AngularFirestore) {}

  findTeamById(id: string): Observable<Team> {
    return this.afs
      .collection("teams", ref =>
        // use firebase.firestore.FieldPath.documentId() to get a collection containing a single document
        // based on the document id. So I didn't have to import the firebase library I used the
        // resolved value of "__name__"
        ref.where("__name__", "==", id)
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

  fieldUpdate(docId: string, fieldName: string, newValue: any) {
    if (docId && fieldName) {
      const updateObject = {};
      dbFieldUpdate("/teams/" + docId, fieldName, newValue, this.afs);
    }
  }

  createTeam(team: Team): Promise<DocumentReference> {
    return this.afs.collection("teams").add(team);
  }

  deleteTeam(id: string): Promise<void> {
    return this.afs
      .collection("teams")
      .doc(id)
      .delete();
  }
}
