import { DarevaluationService } from "./../services/darevaluation.service";
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Dar } from "../models/dar.model";
import { EvaluationScore, Darevaluation } from "../models/darevaluation.model";
import { Subscription, Observable } from "rxjs";
import { DarsolutionService } from "../services/darsolution.service";

@Component({
  selector: "app-darviewevaluation",
  templateUrl: "./darviewevaluation.component.html",
  styleUrls: ["./darviewevaluation.component.scss"]
})
export class DarviewevaluationComponent implements OnInit, OnDestroy {
  @Input() dar: Dar;
  darsolution$$: Subscription;
  evaluations$$: Subscription;
  e$: Observable<Darevaluation[]>;

  constructor(
    private darsolutionService: DarsolutionService,
    private darevaluationService: DarevaluationService
  ) {}

  ngOnInit() {
    // // Build the evaluationMatrix from criteris/solution/evaluation documents
    // this.darsolution$$ = this.darsolutionService
    //   .findAllDarsolutions(this.dar.id, 1000)
    //   .subscribe
    //   // Load solutionEvaluations entry
    //   ();

    console.log("Darviewevaluation", this.dar);
    // this.e$ == this.darevaluationService.findAllForDar(this.dar.id);
    // console.log("Darviewevaluation e$", this.e$);
    this.evaluations$$ = this.darevaluationService
      .findAllForDar(this.dar.id)
      .subscribe(das => {
        console.log("Darviewevaluation evaluations$$", das);
      });
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
