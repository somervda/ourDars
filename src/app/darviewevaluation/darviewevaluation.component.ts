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

  displayEvaluationCell(
    dsid: string,
    dcid: string
  ): { cellText: string; cellTooltip: string; cellBGColor: string } {
    //console.log("displayEvaluationCell", dsid, dcid);
    let cellContent = { cellText: "", cellTooltip: "", cellBGColor: "" };
    if (!dsid || !dcid) {
      cellContent.cellText = " ";
      cellContent.cellTooltip = "Internal Error";
      cellContent.cellBGColor = "red";
      console.error("displayEvaluationCell - missing parameter", dsid, dcid);
    }

    const evaluation: Darevaluation = this.darevaluations.find(
      e => e.id == dcid && e.dsid == dsid
    );
    if (evaluation) {
      cellContent.cellText = evaluation.evaluationScore.toString();
      cellContent.cellTooltip = "Calculated";
      cellContent.cellBGColor = "white";
    } else {
      cellContent.cellText = "-";
      cellContent.cellTooltip = "No evaluation done";
      cellContent.cellBGColor = "WHITESMOKE";
    }

    return cellContent;
  }

  ngOnDestroy() {
    if (this.darsolution$$) this.darsolution$$.unsubscribe();
    if (this.darevaluation$$) this.darevaluation$$.unsubscribe();
    if (this.darcriteria$$) this.darcriteria$$.unsubscribe();
  }
}
