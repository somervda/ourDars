import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { DarService } from "./dar.service";
import { Dar } from "../models/dar.model";
import { Observable } from "rxjs";
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class DarResolver implements Resolve<Dar> {
  constructor(private darservice: DarService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Dar> {
    const id = route.paramMap.get("id");
    return this.darservice.findById(id).pipe(first());
  }
}
