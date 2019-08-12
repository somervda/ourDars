import { EvaluationScore } from './../models/darevaluation.model';
import { Component, OnInit, Input } from "@angular/core";
import { Dar } from "../models/dar.model";
import { Observable, Subscription } from "rxjs";
import { Darsolution } from "../models/darsolution.model";
import { DarsolutionService } from "../services/darsolution.service";
import { DarcriteriaService } from "../services/darcriteria.service";
import { DarevaluationService } from "../services/darevaluation.service";
import { Darcriteria, CriteriaWeighting } from "../models/darcriteria.model";
import { Darevaluation } from "../models/darevaluation.model";

@Component({
  selector: "app-darviewevaluationdetails",
  templateUrl: "./darviewevaluationdetails.component.html",
  styleUrls: ["./darviewevaluationdetails.component.scss"]
})
export class DarviewevaluationdetailsComponent implements OnInit {
  @Input() dar: Dar;
  darsolutions$: Observable<Darsolution[]>;
  darcriterias$: Observable<Darcriteria[]>;
  darevaluation$$: Subscription;
  darevaluations: Darevaluation[];
  EvaluationScore =EvaluationScore;
  CriteriaWeighting = CriteriaWeighting;

  constructor(
    private darsolutionService: DarsolutionService,
    private darcriteriaService: DarcriteriaService,
    private darevaluationService: DarevaluationService
  ) {}

  ngOnInit() {
    console.log("DarviewevaluationdetailsComponent", this.dar);
    this.darsolutions$ = this.darsolutionService.findAllDarsolutions(
      this.dar.id,
      1000
    );

    this.darcriterias$ = this.darcriteriaService.findAllDarcriteria(
      this.dar.id,
      1000
    );

    this.darevaluation$$ = this.darevaluationService
      .findAllForDar(this.dar.id).subscribe(de => this.darevaluations = de);
  }

  getEvaluation(darsolution:Darsolution,darcriteria:Darcriteria) : Darevaluation {
    // console.log("getEvaluation",darsolution,darcriteria)
    let evaluation: Darevaluation ;
    if (this.darevaluations) {
      if (!darsolution || !darcriteria) {
        console.error(
          "getEvaluation - missing parameter",
          darsolution,
          darcriteria
        );
      }
    
      else {
        evaluation = this.darevaluations.find(
          e => e.id == darcriteria.id && e.dsid == darsolution.id
        );
      }
    }
    // console.log("getEvaluation evaluation",evaluation,this.darevaluations)
    return evaluation;
    
  }
}
