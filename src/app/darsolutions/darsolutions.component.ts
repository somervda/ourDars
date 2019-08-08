import { Observable } from "rxjs";
import { DarsolutionService } from "./../services/darsolution.service";
import { Component, OnInit, NgZone, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Dar } from "../models/dar.model";
import { Darsolution } from "../models/darsolution.model";
import { Crud } from "../models/global.model";

@Component({
  selector: "app-darsolutions",
  templateUrl: "./darsolutions.component.html",
  styleUrls: ["./darsolutions.component.scss"]
})
export class DarsolutionsComponent implements OnInit {
  @Input() dar: Dar;
  darsolutions$: Observable<Darsolution[]>;
  displayedColumns: string[] = ["name", "delete"];
  dsid: string;
  crudAction = Crud.Update;
  forCD = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router,
    private darsolutionservice: DarsolutionService
  ) {}

  ngOnInit() {
    // get a observable of all darsolutions related to this dar
    this.darsolutions$ = this.darsolutionservice.findAllDarsolutions(
      this.dar.id,
      100
    );
  }

  selectSolution(dsid: string) {
    this.forCD++;
    this.crudAction = Crud.Update;
    this.dsid = dsid;
  }

  selectDeleteSolution(dsid: string) {
    this.forCD++;
    this.crudAction = Crud.Delete;
    this.dsid = dsid;
  }

  onCreateNew() {
    this.forCD++;
    // Toggle action to for an onChange event in the darSolution component
    this.crudAction = Crud.Create;
  }
}
