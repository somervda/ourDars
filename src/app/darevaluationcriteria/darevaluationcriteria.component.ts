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
  @ViewChild("evaluationScore") evaluationScore;
  @ViewChild("notes") notes;

  CriteriaWeighting = CriteriaWeighting;
  EvaluationScore = EvaluationScore;
  evaluationScoreItems: Kvp[];
  darevaluation$: Subscription;
  darevaluation: Darevaluation;

  constructor(private darevaluationService: DarevaluationService) {}

  ngOnInit() {
    this.evaluationScoreItems = enumToMap(EvaluationScore);

    this.darevaluation$ = this.darevaluationService
      .findById(this.dar.id, this.darsolution.id, this.darcriteria.id)
      .subscribe(evaluations => {
        if (evaluations.length == 0)
          this.darevaluation = { dcid: this.darcriteria.id, notes: "" };
        else this.darevaluation = evaluations[0];
      });
  }

  onUpdate() {
    console.log(
      "onUpdate evaluationScore",
      this.evaluationScore.value,
      " notes:",
      this.notes.nativeElement.value
    );
  }

  ngOnDestroy() {}
}
