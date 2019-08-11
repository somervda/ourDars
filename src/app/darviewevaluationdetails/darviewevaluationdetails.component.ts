import { Component, OnInit, Input } from "@angular/core";
import { Dar } from "../models/dar.model";
import { Observable } from "rxjs";
import { Darsolution } from "../models/darsolution.model";
import { DarsolutionService } from "../services/darsolution.service";
import { DarcriteriaService } from "../services/darcriteria.service";
import { DarevaluationService } from "../services/darevaluation.service";
import { Darcriteria } from "../models/darcriteria.model";
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
  //darevaluation$: Observable<Darevaluation[]>;

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

    // this.darevaluation$ = this.darevaluationService
    //   .findAllForDar(this.dar.id);
  }
}
