import { DarevaluationService } from "./../services/darevaluation.service";
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Dar } from "../models/dar.model";
import { EvaluationScore, Darevaluation } from "../models/darevaluation.model";
import { Subscription, Observable } from "rxjs";
import { DarsolutionService } from "../services/darsolution.service";
import { Darsolution } from "../models/darsolution.model";
import { Darcriteria } from "../models/darcriteria.model";
import { DarcriteriaService } from "../services/darcriteria.service";

@Component({
  selector: "app-darviewevaluation",
  templateUrl: "./darviewevaluation.component.html",
  styleUrls: ["./darviewevaluation.component.scss"]
})
export class DarviewevaluationComponent implements OnInit, OnDestroy {
  @Input() dar: Dar;
  darsolution$$: Subscription;
  darsolutions: Darsolution[];
  darcriteria$$: Subscription;
  darcriterias: Darcriteria[];
  darevaluation$$: Subscription;
  darevaluations: Darevaluation[];

  constructor(
    private darsolutionService: DarsolutionService,
    private darcriteriaService: DarcriteriaService,
    private darevaluationService: DarevaluationService
  ) {}

  ngOnInit() {
    console.log("Darviewevaluation", this.dar);

    this.darsolution$$ = this.darsolutionService
      .findAllDarsolutions(this.dar.id, 1000)
      .subscribe(dsa => (this.darsolutions = dsa));

    this.darcriteria$$ = this.darcriteriaService
      .findAllDarcriteria(this.dar.id, 1000)
      .subscribe(dca => (this.darcriterias = dca));

    this.darevaluation$$ = this.darevaluationService
      .findAllForDar(this.dar.id)
      .subscribe(dea => (this.darevaluations = dea));
  }

  displayEvaluationCell(dsid: string, dcid: string): string {
    console.log("displayEvaluationCell", dsid, dcid);
    if (!dsid || !dcid) return " ";
    const evaluation: Darevaluation = this.darevaluations.find(
      e => e.id == dcid && e.dsid == dsid
    );
    if (evaluation) return evaluation.evaluationScore.toString();
    else return "-";
  }

  ngOnDestroy() {
    if (this.darsolution$$) this.darsolution$$.unsubscribe();
    if (this.darevaluation$$) this.darevaluation$$.unsubscribe();
    if (this.darcriteria$$) this.darcriteria$$.unsubscribe();
  }
}
