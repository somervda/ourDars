import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { TeamService } from "./team.service";
import { Team } from "../models/team.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TeamResolver implements Resolve<Team> {
  constructor(private teamservice: TeamService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Team> {
    const tid = route.paramMap.get("tid");
    return this.teamservice.findTeamByTid(tid);
  }
}
