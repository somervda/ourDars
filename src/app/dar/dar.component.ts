import { Component, OnInit, NgZone } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DarService } from "../services/dar.service";
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Crud, Kvp } from "../models/global.model";
import { enumToMap } from "../shared/utilities";
import { firestore } from "firebase/app";
import { TeamService } from "../services/team.service";

@Component({
  selector: "app-dar",
  templateUrl: "./dar.component.html",
  styleUrls: ["./dar.component.scss"]
})
export class DarComponent implements OnInit {
  dar: Dar;
  crudAction: Crud;
  Crud = Crud;
  DarMethod = DarMethod;
  darMethods: Kvp[];
  darStatuses: Kvp[];
  darForm: FormGroup;
  team$;

  // testDate: Date;

  constructor(
    private darService: DarService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.darMethods = enumToMap(DarMethod);
    this.darStatuses = enumToMap(DarStatus);
    this.team$ = this.teamService.findTeams("", "name", "asc", 100);

    this.crudAction = Crud.Update;
    if (this.route.routeConfig.path == "dar/delete/:id")
      this.crudAction = Crud.Delete;
    if (this.route.routeConfig.path == "dar/create")
      this.crudAction = Crud.Create;

    // console.log("team onInit", this.crudAction);
    if (this.crudAction == Crud.Create) {
      this.dar = {
        title: "",
        description: "",
        darStatus: DarStatus.created,
        darMethod: DarMethod.Process
      };
    } else {
      this.dar = this.route.snapshot.data["dar"];
    }

    // Create form group and initialize with team values
    this.darForm = this.fb.group({
      title: [
        this.dar.title,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(60)
        ]
      ],
      description: [
        this.dar.description,
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(10000)
        ]
      ],
      darStatus: [this.dar.darStatus, [Validators.required]],
      darMethod: [this.dar.darMethod, [Validators.required]],
      dateTargeted: [this.dar.dateTargeted ? this.dar.dateTargeted.toDate() : ''],
      tid: [this.dar.tid ? this.dar.tid : 'NA'],
      risks: [this.dar.risks, [Validators.maxLength(10000)]],
      constraints: [this.dar.constraints, [Validators.maxLength(10000)]],
      cause: [this.dar.cause, [Validators.maxLength(10000)]]
    });

    console.log("dateTargeted",this.dar.dateTargeted ,
     "this.dar.dateTargeted.toDate()", this.dar.dateTargeted.toDate(),
     ' this.darForm.get("dateTargeted").value', this.darForm.get("dateTargeted").value )

    // Mark all fields as touched to trigger validation on initial entry to the fields
    if (this.crudAction != Crud.Create) {
      for (const field in this.darForm.controls) {
        this.darForm.get(field).markAsTouched();
      }
    }
  }

  // Updaters

  createDar() {}
  deleteDar() {
    console.log("delete", this.dar.id);

    this.darService
      .deleteDar(this.dar.id)
      .then(() => {
        this.snackBar.open("DAR '" + this.dar.title + "' deleted!", "", {
          duration: 2000
        });
        this.ngZone.run(() => this.router.navigateByUrl("/adminDars"));
      })
      .catch(function(error) {
        console.error("Error deleting dar: ", error);
      });
  }

  onFieldUpdate(fieldName: string, toType ?: string) {
    if (
      this.darForm.get(fieldName).valid &&
      this.dar.id != "" &&
      this.crudAction != Crud.Delete
    ){
      let newValue = this.darForm.get(fieldName).value;
      // Do any type conversions before storing value
      if (toType && toType == "Timestamp")
        newValue = firestore.Timestamp.fromDate(this.darForm.get(fieldName).value);
      this.darService.fieldUpdate(
        this.dar.id,
        fieldName,
        newValue
      );
    }
  }

}
