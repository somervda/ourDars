import { Component, OnInit, NgZone } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DarService } from "../services/dar.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
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
        [Validators.required, Validators.minLength(50)]
      ],
      darStatus: [""],
      darMethod: [""],
      dateTargeted: [""],
      team: [""],
      votingMajority: [
        this.dar.votingMajority,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ]
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

  get votingMajority() {
    return this.darForm.get("votingMajority");
  }

  createDar() {}
  deleteDar() {}

  onTitleUpdate() {
    if (this.title.valid && this.dar.id != "" && this.crudAction != Crud.Delete)
      this.darService.fieldUpdate(this.dar.id, "title", this.title.value);
  }

  onVotingMajorityUpdate() {
    if (
      this.votingMajority.valid &&
      this.dar.id != "" &&
      this.crudAction != Crud.Delete
    )
      this.darService.fieldUpdate(
        this.dar.id,
        "votingMajority",
        parseInt(this.votingMajority.value)
      );
  }

  onDescriptionUpdate() {
    if (
      this.description.valid &&
      this.dar.id != "" &&
      this.crudAction != Crud.Delete
    )
      this.darService.fieldUpdate(
        this.dar.id,
        "description",
        this.description.value
      );
  }

  onStatusChange(event) {
    // console.log("onStatusChange", event.value);
    this.dar.darStatus = event.value;
    if (this.dar.id != "" && this.crudAction != Crud.Delete) {
      this.darService.fieldUpdate(this.dar.id, "darStatus", this.dar.darStatus);
    }
  }

  onMethodChange(event) {
    // console.log("onMethodChange", event.value);
    this.dar.darMethod = event.value;
    if (this.dar.id != "" && this.crudAction != Crud.Delete) {
      this.darService.fieldUpdate(this.dar.id, "darMethod", this.dar.darMethod);
    }
  }

  onTeamChange(event) {
    console.log("onTeamChange", event);
    this.dar.tid = event.value;
    if (this.dar.id != "" && this.crudAction != Crud.Delete) {
      this.darService.fieldUpdate(this.dar.id, "tid", this.dar.tid);
    }
  }

  onDateTargetedChange(event) {
    this.dar.dateTargeted = firestore.Timestamp.fromDate(event.value);
    if (this.dar.id != "" && this.crudAction != Crud.Delete) {
      this.darService.fieldUpdate(
        this.dar.id,
        "dateTargeted",
        this.dar.dateTargeted
      );
    }
  }
}
