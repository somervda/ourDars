import { DarevaluationService } from "./../services/darevaluation.service";
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Dar } from "../models/dar.model";
import { EvaluationScore, Darevaluation } from "../models/darevaluation.model";
import { Subscription, Observable } from "rxjs";
import { DarsolutionService } from "../services/darsolution.service";
import { Darsolution } from "../models/darsolution.model";
import { Darcriteria, CriteriaWeighting } from "../models/darcriteria.model";
import { DarcriteriaService } from "../services/darcriteria.service";
import { ScrollStrategyOptions } from "@angular/cdk/overlay";

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
    darsolution: Darsolution,
    darcriteria: Darcriteria
  ): { cellText: string; cellTooltip: string; cellBGColor: string } {
    let cellContent = { cellText: "", cellTooltip: "", cellBGColor: "" };
    // console.log("displayEvaluationCell", darsolution, darcriteria,this.darevaluations);
    if (this.darevaluations) {
      if (!darsolution || !darcriteria) {
        console.error(
          "displayEvaluationCell - missing parameter",
          darsolution,
          darcriteria
        );
      }

      const evaluation: Darevaluation = this.darevaluations.find(
        e => e.id == darcriteria.id && e.dsid == darsolution.id
      );
      if (evaluation && evaluation.evaluationScore) {
        const score = this.calculateCellScore(
          darsolution,
          darcriteria,
          evaluation
        );
        cellContent.cellText = score.value.toString();
        cellContent.cellTooltip = score.rational;
        cellContent.cellBGColor = score.color;
      } else {
        cellContent.cellText = "-";
        cellContent.cellTooltip = "No evaluation done";
        cellContent.cellBGColor = "WHITESMOKE";
      }
    }

    return cellContent;
  }

  calculateCellScore(
    darsolution: Darsolution,
    darcriteria: Darcriteria,
    evaluation: Darevaluation
  ): { value: number; rational: string; color: string } {
    let score = {
      value: 0,
      rational:
        "Criteria:" +
        CriteriaWeighting[darcriteria.weighting] +
        " Evaluation_Score:" +
        EvaluationScore[evaluation.evaluationScore],
      color: ""
    };

    const warningColor = "Salmon";
    const attentionColor = "Bisque";

    // Rules
    // Critical: Fully Met 8, met 4 , met workarounds 2, partially met/ not met (warning)
    // Important: Fully Met 5, met 4, met workarounds 3, partially met 1 , not met 0 (warning)
    // Desirable: Fully Met 1, met 1 , met workarounds 1, partially met 0,  not met 0
    if (darcriteria.weighting == CriteriaWeighting.Critical) {
      if (evaluation.evaluationScore == EvaluationScore["Fully Met"])
        score.value = 8;
      if (evaluation.evaluationScore == EvaluationScore.Met) score.value = 4;
      if (evaluation.evaluationScore == EvaluationScore["Met with Workarounds"])
        score.value = 2;
      if (evaluation.evaluationScore == EvaluationScore["Partially Met"]) {
        score.value = 0;
        score.rational +=
          ". Note: Critical criterial not given a score when only partially met";
        score.color = attentionColor;
      }
      if (evaluation.evaluationScore == EvaluationScore["Not Met"]) {
        score.value = 0;
        score.rational +=
          ". Note: Critical criterial must be met to get a score.";
        score.color = warningColor;
      }
    }

    if (darcriteria.weighting == CriteriaWeighting.Important) {
      if (evaluation.evaluationScore == EvaluationScore["Fully Met"])
        score.value = 5;
      if (evaluation.evaluationScore == EvaluationScore.Met) score.value = 4;
      if (evaluation.evaluationScore == EvaluationScore["Met with Workarounds"])
        score.value = 3;
      if (evaluation.evaluationScore == EvaluationScore["Partially Met"])
        score.value = 1;
      if (evaluation.evaluationScore == EvaluationScore["Not Met"]) {
        score.value = 0;
        score.rational += ". Unable to met Important criteria at any level.";
        score.color = attentionColor;
      }
    }

    if (darcriteria.weighting == CriteriaWeighting.Desirable) {
      if (evaluation.evaluationScore == EvaluationScore["Fully Met"])
        score.value = 1;
      if (evaluation.evaluationScore == EvaluationScore.Met) score.value = 1;
      if (evaluation.evaluationScore == EvaluationScore["Met with Workarounds"])
        score.value = 1;
      if (evaluation.evaluationScore == EvaluationScore["Partially Met"])
        score.value = 0;
      if (evaluation.evaluationScore == EvaluationScore["Not Met"])
        score.value = 0;
    }

    return score;
  }

  displaySolutionScore(darsolution): string {
    let totalScore = 0;
    if (this.darevaluations && this.darcriterias) {
      this.darcriterias.forEach(darcriteria => {
        const evaluation: Darevaluation = this.darevaluations.find(
          e => e.id == darcriteria.id && e.dsid == darsolution.id
        );
        if (evaluation)
          totalScore += this.calculateCellScore(
            darsolution,
            darcriteria,
            evaluation
          ).value;
      });
    }

    return totalScore.toString();
  }

  ngOnDestroy() {
    if (this.darsolution$$) this.darsolution$$.unsubscribe();
    if (this.darevaluation$$) this.darevaluation$$.unsubscribe();
    if (this.darcriteria$$) this.darcriteria$$.unsubscribe();
  }
}
