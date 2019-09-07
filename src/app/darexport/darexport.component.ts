import { DarevaluationService } from "./../services/darevaluation.service";
import { Darcriteria } from "./../models/darcriteria.model";
import { DaruserService } from "./../services/daruser.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Dar } from "../models/dar.model";
import { Observable } from "rxjs";
import { Darsolution } from "../models/darsolution.model";
import { DarsolutionService } from "../services/darsolution.service";
import { Daruser } from "../models/daruser.model";
import { DarcriteriaService } from "../services/darcriteria.service";
import { Darevaluation } from "../models/darevaluation.model";

@Component({
  selector: "app-darexport",
  templateUrl: "./darexport.component.html",
  styleUrls: ["./darexport.component.scss"]
})
export class DarexportComponent implements OnInit {
  dar: Dar;
  darSolutions$: Observable<Darsolution[]>;
  darUsers$: Observable<Daruser[]>;
  darCriteria$: Observable<Darcriteria[]>;
  darEvaluations$: Observable<Darevaluation[]>;
  constructor(
    private route: ActivatedRoute,
    private darsolutionService: DarsolutionService,
    private daruserService: DaruserService,
    private darcriteriaService: DarcriteriaService,
    private darevaluationsService: DarevaluationService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    this.darSolutions$ = this.darsolutionService.findAllDarsolutions(
      this.dar.id,
      1000
    );
    this.darUsers$ = this.daruserService.findAllDarusers(this.dar.id, 1000);
    this.darCriteria$ = this.darcriteriaService.findAllDarcriteria(
      this.dar.id,
      1000
    );
    this.darEvaluations$ = this.darevaluationsService.findAllForDar(
      this.dar.id
    );
  }
}
