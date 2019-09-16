import { DarService } from "./../services/dar.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dar, DarStatus, DarMethod, DarNextStatus } from "../models/dar.model";
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
import { MatSnackBar } from "@angular/material";

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
  darSolution$: Observable<Darsolution>;
  darCriterias$: Observable<Darcriteria[]>;
  CriteriaWeighting = CriteriaWeighting;
  darNextStatus = {} as DarNextStatus;

  sm = false;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private darService: DarService,
    private daruserService: DaruserService,
    private darsolutionService: DarsolutionService,
    private darcriteriaService: DarcriteriaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    this.did = this.dar.id;
    // Get the darNextStatus information
    this.darNextStatus = this.darService.getDarNextStatus(this.dar);


    // Get the indow width to use when displaying long text on small screen devices (<740 px)
    // It should result in full text being able to be shown in devices that are iPad mini or larger screens
    this.sm = window.innerWidth < 740;
    if (this.sm) {
      // mat-snackBar doesn't like to be called from onInit so the use of the promise below
      // is bit of a hack to remove the console error messages
      Promise.resolve().then(() => {
        this.snackBar.open(
          "Your browser window is less than 740 pixels wide so " +
            "some text have been abbreviated, use a full size browser to show the full DAR document.",
          "",
          {
            duration: 8000
          }
        );
      });
    }

    this.dar$$ = this.darService.findById(this.did).subscribe(dar => {
      this.dar = dar;
      this.team$ = this.teamService.findById(this.dar.tid);
      this.darUsers$ = this.daruserService.findAllDarusers(this.did, 1000);
      this.darSolutions$ = this.darsolutionService.findAllDarsolutions(
        this.did,
        1000
      );
      // console.log("ngOnInit findById did:",this.did , " dsid:",this.dar.dsid);
      if (this.dar.dsid) {
        this.darSolution$ = this.darsolutionService.findById(
          this.did,
          this.dar.dsid
        );
      }
      this.darCriterias$ = this.darcriteriaService.findAllDarcriteria(
        this.did,
        1000
      );
    });
  }

  ngOnDestroy() {
    if (this.dar$$) this.dar$$.unsubscribe();
  }

  toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }
}
