import { Component, OnInit, Input, NgZone } from "@angular/core";
import { Dar } from "../models/dar.model";
import { Observable } from "rxjs";
import { Darcriteria, CriteriaWeighting } from "../models/darcriteria.model";
import { Crud } from "../models/global.model";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { DarcriteriaService } from "../services/darcriteria.service";

@Component({
  selector: "app-darcriterias",
  templateUrl: "./darcriterias.component.html",
  styleUrls: ["./darcriterias.component.scss"]
})
export class DarcriteriasComponent implements OnInit {
  @Input() dar: Dar;
  darcriteria$: Observable<Darcriteria[]>;
  displayedColumns: string[] = ["name", "weighting", "delete"];
  dcid: string;
  crudAction = Crud.Update;
  CriteriaWeighting = CriteriaWeighting;
  forCD = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router,
    private darcriteriaservice: DarcriteriaService
  ) {}

  ngOnInit() {
    // get a observable of all darsolutions related to this dar
    this.darcriteria$ = this.darcriteriaservice.findAllDarcriteria(
      this.dar.id,
      100
    );
    //console.log(this.CriteriaWeighting[2]);
  }

  selectCriteria(dcid: string) {
    this.forCD++;
    this.crudAction = Crud.Update;
    this.dcid = dcid;
  }

  selectDeleteCriteria(dcid: string) {
    this.forCD++;
    this.crudAction = Crud.Delete;
    this.dcid = dcid;
  }

  onCreateNew() {
    this.forCD++;
    // Toggle action to for an onChange event in the darSolution component
    this.crudAction = Crud.Create;
  }
}
