import { DarevaluationService } from "./../services/darevaluation.service";
import { Darcriteria } from "./../models/darcriteria.model";
import { DaruserService } from "./../services/daruser.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Dar } from "../models/dar.model";
import { Observable } from "rxjs";
import { Darsolution } from "../models/darsolution.model";
import { DarsolutionService } from "../services/darsolution.service";
import { Daruser } from "../models/daruser.model";
import { DarcriteriaService } from "../services/darcriteria.service";
import { Darevaluation } from "../models/darevaluation.model";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-darexport",
  templateUrl: "./darexport.component.html",
  styleUrls: ["./darexport.component.scss"]
})
export class DarexportComponent implements OnInit {
  @ViewChild("txtJSON", { static: true }) txtJSON;
  dar: Dar;
  darSolutions$: Observable<Darsolution[]>;
  darUsers$: Observable<Daruser[]>;
  darCriteria$: Observable<Darcriteria[]>;
  darEvaluations$: Observable<Darevaluation[]>;
  constructor(
    private route: ActivatedRoute,
    private darsolutionService: DarsolutionService,
    private daruserService: DaruserService,
    private darcriteriaService: DarcriteriaService,
    private darevaluationsService: DarevaluationService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    this.darSolutions$ = this.darsolutionService.findAllDarsolutions(
      this.dar.id,
      1000
    );
    this.darUsers$ = this.daruserService.findAllDarusers(this.dar.id, 1000);
    this.darCriteria$ = this.darcriteriaService.findAllDarcriteria(
      this.dar.id,
      1000
    );
    this.darEvaluations$ = this.darevaluationsService.findAllForDar(
      this.dar.id
    );
  }

  onCopy() {
    console.log(this.txtJSON.nativeElement);
    /* Select the text field */
    this.txtJSON.nativeElement.select();
    this.txtJSON.nativeElement.setSelectionRange(
      0,
      99999
    ); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    this.snackbar.open("DAR JSON copied to clipboard.", "", {
      duration: 2000
    });
  }
}
