import { Component, OnInit, NgZone } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DarService } from "../services/dar.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Crud, Kvp } from "../models/global.model";
import { enumToMap } from "../shared/utilities";
import * as firebase from "firebase";

@Component({
  selector: "app-dar",
  templateUrl: "./dar.component.html",
  styleUrls: ["./dar.component.scss"]
})
export class DarComponent implements OnInit {
  dar: Dar;
  crudAction: Crud;
  crud = Crud;
  darMethod: Kvp[];
  darStatus: Kvp[];
  darForm: FormGroup;

  // testDate: Date;

  constructor(
    private darService: DarService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
    this.darMethod = enumToMap(DarMethod);
    this.darStatus = enumToMap(DarStatus);

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
        [Validators.required, Validators.minLength(50)]
      ],
      darStatus: [this.dar.darStatus],
      darMethod: [this.dar.darMethod],
      dateTargeted: [""]
    });

    // this.testDate = new Date(2019, 11, 1, 10, 33, 30, 0);
    // console.log("myDatepicker", this.testDate);

    console.log("dar", this.dar);
    console.log("darForm", this.darForm);

    // Mark all fields as touched to trigger validation on initial entry to the fields
    if (this.crudAction != Crud.Create) {
      this.title.markAsTouched();
      this.description.markAsTouched();
    }
  }

  // Getters
  get title() {
    return this.darForm.get("title");
  }

  get description() {
    return this.darForm.get("description");
  }

  get dateTargeted() {
    return this.darForm.get("dateTargeted");
  }

  createDar() {}
  deleteDar() {}
  onTitleUpdate() {}
  onDescriptionUpdate() {}
  onDateTargetedChange(event) {
    // console.log("dateTargetedChange", this.dateTargeted.value);
    // console.log("dateTargetedChange event", event);
    if (this.dar.id != "" && this.crudAction != Crud.Delete) {
      this.dar.dateTargeted = firebase.firestore.Timestamp.fromDate(
        event.value
      );
      this.darService.fieldUpdate(
        this.dar.id,
        "dateTargeted",
        this.dar.dateTargeted
      );
    }
  }
}
