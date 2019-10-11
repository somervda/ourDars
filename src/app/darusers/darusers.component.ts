import { Component, OnInit, Input, NgZone } from "@angular/core";
import { Dar } from "../models/dar.model";
import { Observable } from "rxjs";
import { Daruser } from "../models/daruser.model";
import { Crud } from "../models/global.model";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { DaruserService } from "../services/daruser.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-darusers",
  templateUrl: "./darusers.component.html",
  styleUrls: ["./darusers.component.scss"]
})
export class DarusersComponent implements OnInit {
  @Input() dar: Dar;
  darusers$: Observable<Daruser[]>;
  displayedColumns: string[] = ["email", "Roles", "delete"];
  duid: string;
  crudAction = Crud.Update;
  forCD = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router,
    private auth: AuthService,
    private daruserservice: DaruserService
  ) {}

  ngOnInit() {
    // get a observable of all darusers related to this dar
    this.darusers$ = this.daruserservice.findAllDarusers(this.dar.id, 100);
  }

  selectUser(duid: string) {
    this.forCD++;
    this.crudAction = Crud.Update;
    this.duid = duid;
  }

  selectDeleteUser(duid: string) {
    this.forCD++;
    this.crudAction = Crud.Delete;
    this.duid = duid;
  }

  onCreateNew() {
    this.forCD++;
    // Toggle action to for an onChange event in the darSolution component
    this.crudAction = Crud.Create;
  }
}
