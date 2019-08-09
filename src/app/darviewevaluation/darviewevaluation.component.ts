import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Dar } from "../models/dar.model";
import { EvaluationScore } from "../models/darevaluation.model";
import { Subscription } from "rxjs";
import { DarsolutionService } from "../services/darsolution.service";

@Component({
  selector: "app-darviewevaluation",
  templateUrl: "./darviewevaluation.component.html",
  styleUrls: ["./darviewevaluation.component.scss"]
})
export class DarviewevaluationComponent implements OnInit, OnDestroy {
  @Input() dar: Dar;
  darsolution$$: Subscription;
  solutionEvaluations$$: Subscription[];

  constructor(private darsolutionService: DarsolutionService) {}

  ngOnInit() {
    // Build the evaluationMatrix from criteris/solution/evaluation documents
    this.darsolution$$ = this.darsolutionService
      .findAllDarsolutions(this.dar.id, 1000)
      .subscribe
      // Load solutionEvaluations entry
      ();
  }

  ngOnDestroy() {
    if (this.darsolution$$) this.darsolution$$.unsubscribe();
  }
}

interface SolutionEvaluation {
  dsid: string;
  solutionName: string;
  evaluation: { dcid: string; evaluationScore: EvaluationScore }[];
}
