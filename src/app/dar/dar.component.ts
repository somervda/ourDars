import { Component, OnInit, NgZone } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DarService } from "../services/dar.service";
import { Validators, FormBuilder, FormGroup, AbstractControl } from "@angular/forms";
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
      darStatus: ["",[Validators.required]],
      darMethod: ["",[Validators.required]],
      dateTargeted: [""],
      team: [""],
      risks: [this.dar.risks, [Validators.maxLength(10000)]],
      constraints: [this.dar.constraints, [Validators.maxLength(10000)]],
      cause: [this.dar.cause, [Validators.maxLength(10000)]]
    });

    // Mark all fields as touched to trigger validation on initial entry to the fields
    if (this.crudAction != Crud.Create) {
      for (const field in this.darForm.controls) {
        this.darForm.get(field).markAsTouched();
      }
    }
  }

  // Getters
  get title() {
    return this.darForm.get("title");
  }

  get description() {
    return this.darForm.get("description");
  }

  get darStatus() {
    return this.darForm.get("darStatus");
  }

  get darMethod() {
    return this.darForm.get("darMethod");
  }

  get dateTargeted() {
    return this.darForm.get("dateTargeted");
  }

  get team() {
    return this.darForm.get("team");
  }

  get risks() {
    return this.darForm.get("risks");
  }

  get constraints() {
    return this.darForm.get("constraints");
  }

  get cause() {
    return this.darForm.get("cause");
  }

  // Updaters

  createDar() {}
  deleteDar() {}

  checkUpdateReady(field : AbstractControl ) : boolean {
    return field.valid && this.dar.id != "" && this.crudAction != Crud.Delete;
  }

  onCauseUpdate() {
    if (this.checkUpdateReady(this.cause))
      this.darService.fieldUpdate(this.dar.id, "cause", this.cause.value);
  }

  onConstraintsUpdate() {
    if (this.checkUpdateReady(this.constraints))
      this.darService.fieldUpdate(
        this.dar.id,
        "constraints",
        this.constraints.value
      );
  }

  onRisksUpdate() {
    if (this.checkUpdateReady(this.risks))
      this.darService.fieldUpdate(this.dar.id, "risks", this.risks.value);
  }

  onTitleUpdate() {
    if (this.checkUpdateReady(this.title))
      this.darService.fieldUpdate(this.dar.id, "title", this.title.value);
  }

  onDescriptionUpdate() {
    if (this.checkUpdateReady(this.description))
      this.darService.fieldUpdate(
        this.dar.id,
        "description",
        this.description.value
      );
  }

  onStatusChange(event) {
    // console.log("onStatusChange", event.value);
    this.dar.darStatus = event.value;
    if (this.checkUpdateReady(this.darStatus)) {
      this.darService.fieldUpdate(this.dar.id, "darStatus", this.dar.darStatus);
    }
  }

  onMethodChange(event) {
    // console.log("onMethodChange", event.value);
    this.dar.darMethod = event.value;
    if (this.checkUpdateReady(this.darMethod)) {
      this.darService.fieldUpdate(this.dar.id, "darMethod", this.dar.darMethod);
      }
    }
  

  onTeamChange(event) {
    console.log("onTeamChange", event);
    this.dar.tid = event.value;
    if (this.checkUpdateReady(this.team)) {
      this.darService.fieldUpdate(this.dar.id, "tid", this.dar.tid);
    }
  }

  onDateTargetedChange(event) {
    this.dar.dateTargeted = firestore.Timestamp.fromDate(event.value);
    if (this.checkUpdateReady(this.dateTargeted)) {
      this.darService.fieldUpdate(
        this.dar.id,
        "dateTargeted",
        this.dar.dateTargeted
      );
    }
  }
}
