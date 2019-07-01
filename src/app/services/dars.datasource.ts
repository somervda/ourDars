import { CollectionViewer, DataSource } from "@angular/cdk/collections";


import { catchError, finalize } from "rxjs/operators";
import { of, Observable, BehaviorSubject } from "rxjs";
import { DarService } from "./dar.service";
import OrderByDirection = firebase.firestore.OrderByDirection;
import { Dar } from '../models/dar.model';

export class DarsDataSource implements DataSource<Dar> {
  private darsSubject = new BehaviorSubject<Dar[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  constructor(private darService: DarService) {}

  loadDars(
    filter: string,
    sortField: string,
    sortOrder: OrderByDirection,
    pageSize: number
  ) {
    this.loadingSubject.next(true);

    this.darService
      .findDars(filter, sortField, sortOrder, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(dars => {
        this.darsSubject.next(dars);
        this.loadingSubject.next(false);
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<Dar[]> {
    // console.log("Connecting team data source");
    return this.darsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.darsSubject.complete();
    this.loadingSubject.complete();
  }
}
