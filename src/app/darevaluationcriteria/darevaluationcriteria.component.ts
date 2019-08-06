import { CriteriaEvaluation } from "./../models/darsolution.model";
import { DarsolutionService } from "./../services/darsolution.service";
import { CriteriaWeighting } from "./../models/darcriteria.model";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Darcriteria } from "../models/darcriteria.model";
import { EvaluationScore, Darsolution } from "../models/darsolution.model";
import { enumToMap } from "../shared/utilities";
import { Kvp } from "../models/global.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-darevaluationcriteria",
  templateUrl: "./darevaluationcriteria.component.html",
  styleUrls: ["./darevaluationcriteria.component.scss"]
})
export class DarevaluationcriteriaComponent implements OnInit, OnDestroy {
  @Input() darcriteria: Darcriteria;
  @Input() dsid: string;
  @Input() did: string;
  CriteriaWeighting = CriteriaWeighting;
  EvaluationScore = EvaluationScore;
  evaluationScoreItems: Kvp[];
  darsolution: Darsolution;
  darsolution$: Subscription;

  constructor(private darsolutionservice: DarsolutionService) {}

  ngOnInit() {
    this.evaluationScoreItems = enumToMap(EvaluationScore);
    this.darsolution$ = this.darsolutionservice
      .findById(this.did, this.dsid)
      .subscribe(ds => {
        this.darsolution = ds;
        this.cleanupCriteriaEvaluations();
      });
  }

  cleanupCriteriaEvaluations() {
    // make sure there is a item in he array for the current criteria
    // and standard properties are set up
    if (!this.darsolution.criteriaEvaluations)
      this.darsolution.criteriaEvaluations = [];
    //  Create a default criteria entry if one doesn't exist
    if (
      !this.darsolution.criteriaEvaluations.find(
        data => data.dcid == this.darcriteria.id
      )
    )
      !this.darsolution.criteriaEvaluations.push({
        dcid: this.darcriteria.id,
        notes: "",
        evaluationScore: undefined
      });
  }

  ngOnDestroy() {
    if (this.darsolution$) this.darsolution$.unsubscribe();
  }
}
