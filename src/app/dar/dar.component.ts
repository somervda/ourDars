import { DarsolutionService } from "./../services/darsolution.service";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit, NgZone, OnDestroy, Input } from "@angular/core";
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
import { Subscription, Observable } from "rxjs";
import { disableDebugTools } from "@angular/platform-browser";
import { DaruserService } from "../services/daruser.service";
import { Darsolution } from "../models/darsolution.model";
import { switchMap, toArray } from "rxjs/operators";
import { from } from "rxjs";

@Component({
  selector: "app-dar",
  templateUrl: "./dar.component.html",
  styleUrls: ["./dar.component.scss"]
})
export class DarComponent implements OnInit, OnDestroy {
  // dar: Dar;
  @Input() crudAction: Crud;
  @Input() dar: Dar;
  Crud = Crud;
  DarMethod = DarMethod;
  darMethods: Kvp[];
  darStatuses: Kvp[];
  nextDarStatuses: Kvp[];
  darSolutions$: Observable<Darsolution[]>;
  form: FormGroup;
  team$;
  dar$$: Subscription;
  isStatusShown = false;

  // testDate: Date;

  constructor(
    private darService: DarService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router,
    private teamService: TeamService,
    private daruserService: DaruserService,
    private auth: AuthService,
    private darsolutionService: DarsolutionService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.darMethods = enumToMap(DarMethod);
    this.darStatuses = enumToMap(DarStatus);

    this.team$ = this.teamService.findTeams("", "name", "asc", 100);

    console.log("dar onInit", this.crudAction);
    if (this.crudAction == Crud.Create) {
      this.dar = {
        title: "",
        description: "",
        darStatus: DarStatus.create,
        darMethod: DarMethod.Process
      };
      // Create is the only valid next status
      this.nextDarStatuses = this.darStatuses.filter(
        s => s.key == DarStatus.create
      );
    } else {
      this.dar = this.route.snapshot.data["dar"];

      // Subscribe to dar to keep getting realtime updates
      this.dar$$ = this.darService.findById(this.dar.id).subscribe(dar => {
        this.dar = dar;

        this.getNextStatus();
        this.darSolutions$ = this.darsolutionService.findAllDarsolutions(
          this.dar.id,
          100
        );
        // console.log("subscribed dar", this.dar);
        this.form.patchValue(this.dar);
        // Also need to patch the dateTargeted individually to apply
        // the toDate() transformation
        if (this.dar.dateTargeted) {
          this.form.controls["dateTargeted"].patchValue(
            this.dar.dateTargeted.toDate()
          );
        }

        const darNextStatus = this.darService.getDarNextStatus(this.dar);
        if (
          darNextStatus.comment &&
          darNextStatus.comment != "" &&
          !this.isStatusShown
        ) {
          this.isStatusShown = true;
          let statusInfoSnackBarRef = this.snackBar.open(
            darNextStatus.comment + " " + darNextStatus.explanation,
            "Close",
            {
              duration: 15000
            }
          );
        }
      });
    }

    // Create form group and initialize with team values
    this.form = this.fb.group({
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
      dateTargeted: [
        this.dar.dateTargeted ? this.dar.dateTargeted.toDate() : ""
      ],
      tid: [this.dar.tid ? this.dar.tid : "NA"],
      risks: [this.dar.risks, [Validators.maxLength(10000)]],
      constraints: [this.dar.constraints, [Validators.maxLength(10000)]],
      cause: [this.dar.cause, [Validators.maxLength(10000)]],
      dsid: [this.dar.dsid]
    });

    // Mark all fields as touched to trigger validation on initial entry to the fields
    if (this.crudAction != Crud.Create) {
      for (const field in this.form.controls) {
        this.form.get(field).markAsTouched();
      }
    }
  }

  getNextStatus() {
    // For DarOwners only allow next status based on the standard workflow
    // Otherwise admin users can set any status
    console.log("getNextStatus", this.dar, this.auth.currentUser);
    if (this.dar.darUserIndexes.isOwner.includes(this.auth.currentUser.uid)) {
      console.log("isOwner");
      const darNextStatus = this.darService.getDarNextStatus(this.dar);
      console.log("nextValidStatus", darNextStatus);
      this.nextDarStatuses = this.darStatuses.filter(
        s =>
          darNextStatus.darStatus.includes(s.key) || s.key == this.dar.darStatus
      );
    }

    if (this.auth.currentUser.isAdmin)
      this.nextDarStatuses = [...this.darStatuses];
  }

  // Updaters

  onCreate() {
    console.log("onCreated begin");
    for (const field in this.form.controls) {
      if (field == "dateTargeted" && this.form.get("dateTargeted").value != "")
        this.dar["dateTargeted"] = firestore.Timestamp.fromDate(
          this.form.get("dateTargeted").value
        );
      else if (field != "dateTargeted")
        this.dar[field] = this.form.get(field).value;
    }
    console.log("onCreated", this.dar);

    this.darService
      .createDar(this.dar)
      .then(docRef => {
        // Create darUser record, make the creator the owner
        const did = docRef.id;
        const darUser = {
          email: this.auth.currentUser.email,
          displayName: this.auth.currentUser.displayName,
          isEvaluator: false,
          isReader: false,
          isOwner: true,
          isStakeholder: false,
          isVoter: false
        };
        this.daruserService
          .createDaruser(did, this.auth.currentUser.uid, darUser)
          .then(duRef => {
            //
            this.snackBar.open("DAR '" + this.dar.title + "' created.", "", {
              duration: 2000
            });
            this.ngZone.run(() =>
              this.router.navigateByUrl("/darfolder/" + did)
            );
          })
          .catch(function(error) {
            console.error("Error creating DARuser: ", error);
          });
      })
      .catch(function(error) {
        console.error("Error creating DAR: ", error);
      });
  }

  onDelete() {
    console.log("delete", this.dar.id);

    // Only logical deletes performed (darStatus set to deleted)
    this.darService.fieldUpdate(this.dar.id, "darStatus", DarStatus.deleted)

    this.snackBar.open("DAR '" + this.dar.title + "' deleted!", "", {
      duration: 2000
    });
    // Only administrators can delete DARs so return to the adminDar page
    this.ngZone.run(() => this.router.navigateByUrl("/adminDars"));

  }

  onFieldUpdate(fieldName: string, toType?: string) {
    if (
      this.form.get(fieldName).valid &&
      this.dar.id != "" &&
      this.crudAction != Crud.Delete
    ) {
      let newValue = this.form.get(fieldName).value;
      // Do any type conversions before storing value
      if (toType && toType == "Timestamp")
        newValue = firestore.Timestamp.fromDate(this.form.get(fieldName).value);
      if (toType && toType == "Blankable" && !this.form.get(fieldName).value) {
        console.log("Blankable", this.form.get(fieldName).value);
        newValue = "";
      }
      // Status change check
      // if (this.dar.darStatus === DarStatus.create) {
      //   if (this.dar.)
      // }

      this.darService.fieldUpdate(this.dar.id, fieldName, newValue);
    }
  }

  ngOnDestroy() {
    if (this.dar$$) {
      this.dar$$.unsubscribe();
      // console.log("Unsubscribe DAR");
    }
  }
}
