import { CriteriaWeighting } from "./../models/darcriteria.model";
import { Component, OnInit, Input, OnDestroy, ViewChild } from "@angular/core";
import { Darcriteria } from "../models/darcriteria.model";
import { Darsolution } from "../models/darsolution.model";
import { enumToMap } from "../shared/utilities";
import { Kvp } from "../models/global.model";
import { Subscription, Observable } from "rxjs";
import { Dar } from "../models/dar.model";
import { Darevaluation, EvaluationScore } from "../models/darevaluation.model";
import { DarevaluationService } from "../services/darevaluation.service";

@Component({
  selector: "app-darevaluationcriteria",
  templateUrl: "./darevaluationcriteria.component.html",
  styleUrls: ["./darevaluationcriteria.component.scss"]
})
export class DarevaluationcriteriaComponent implements OnInit, OnDestroy {
  @Input() darcriteria: Darcriteria;
  @Input() darsolution: Darsolution;
  @Input() dar: Dar;
  @ViewChild("evaluationScore", { static: true }) evaluationScore;
  @ViewChild("notes", { static: true }) notes;

  CriteriaWeighting = CriteriaWeighting;
  EvaluationScore = EvaluationScore;
  evaluationScoreItems: Kvp[];

  darevaluation$$: Subscription;
  darevaluation: Darevaluation;

  constructor(private darevaluationService: DarevaluationService) {}

  ngOnInit() {
    this.evaluationScoreItems = enumToMap(EvaluationScore);

    this.darevaluation$$ = this.darevaluationService
      .findById(this.dar.id, this.darsolution.id, this.darcriteria.id)
      .subscribe(evaluation => {
        console.log("darEvaluation ngOnInit subscribe", evaluation);
        this.darevaluation = evaluation;
        // if (!this.darevaluation.notes) this.darevaluation["notes"] = "";
      });
  }

  onUpdate() {
    console.log(
      "onUpdate evaluationScore",
      this.evaluationScore.value,
      " notes:",
      this.notes.nativeElement.value
    );
    if (!this.evaluationScore.value)
      delete this.darevaluation["evaluationScore"];
    else this.darevaluation["evaluationScore"] = this.evaluationScore.value;
    this.darevaluation["notes"] = this.notes.nativeElement.value;
    this.darevaluationService
      .setEvaluation(
        this.dar.id,
        this.darsolution.id,
        this.darcriteria.id,
        this.darevaluation
      )
      .then()
      .catch(error =>
        console.error("darevaluationcriteria onUpdate error", error)
      );
  }

  ngOnDestroy() {}
}
