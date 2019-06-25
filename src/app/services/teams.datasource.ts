import { CollectionViewer, DataSource } from "@angular/cdk/collections";

import { Team } from "../models/team.model";
import { catchError, finalize } from "rxjs/operators";
import { of, Observable, BehaviorSubject } from "rxjs";
import { TeamService } from "./team.service";
import OrderByDirection = firebase.firestore.OrderByDirection;

export class TeamsDataSource implements DataSource<Team> {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  constructor(private teamService: TeamService) {}

  loadTeams(
    filter: string,
    sortField: string,
    sortOrder: OrderByDirection,
    pageSize: number
  ) {
    this.loadingSubject.next(true);

    this.teamService
      .findTeams(filter, sortField, sortOrder, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(teams => {
        this.teamsSubject.next(teams);
        this.loadingSubject.next(false);
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<Team[]> {
    console.log("Connecting team data source");
    return this.teamsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.teamsSubject.complete();
    this.loadingSubject.complete();
  }
}
