import { DarService } from "./../services/dar.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute } from "@angular/router";
import { TeamService } from "../services/team.service";
import { Observable, Subscription } from "rxjs";
import { Team } from "../models/team.model";
import { Daruser } from "../models/daruser.model";
import { DaruserService } from "../services/daruser.service";
import { DarsolutionService } from "../services/darsolution.service";
import { Darsolution } from "../models/darsolution.model";
import { Darcriteria, CriteriaWeighting } from "../models/darcriteria.model";
import { DarcriteriaService } from "../services/darcriteria.service";
import { share } from "rxjs/operators";

@Component({
  selector: "app-darview",
  templateUrl: "./darview.component.html",
  styleUrls: ["./darview.component.scss"]
})
export class DarviewComponent implements OnInit, OnDestroy {
  dar: Dar;
  DarStatus = DarStatus;
  DarMethod = DarMethod;
  team$: Observable<Team>;
  dar$$: Subscription;
  did: string;
  darUsers$: Observable<Daruser[]>;
  darSolutions$: Observable<Darsolution[]>;
  darCriterias$: Observable<Darcriteria[]>;
  CriteriaWeighting = CriteriaWeighting;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private darService: DarService,
    private daruserService: DaruserService,
    private darsolutionService: DarsolutionService,
    private darcriteriaService: DarcriteriaService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    this.did = this.dar.id;

    this.dar$$ = this.darService.findById(this.did).subscribe(dar => {
      this.dar = dar;
      this.team$ = this.teamService.findById(this.dar.tid);
      this.darUsers$ = this.daruserService.findAllDarusers(this.did, 1000);
      this.darSolutions$ = this.darsolutionService.findAllDarsolutions(
        this.did,
        1000
      );
      this.darCriterias$ = this.darcriteriaService.findAllDarcriteria(
        this.did,
        1000
      );
    });
  }

  ngOnDestroy() {
    if (this.dar$$) this.dar$$.unsubscribe();
  }
}
