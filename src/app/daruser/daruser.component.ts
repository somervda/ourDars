import { Component, OnInit, OnDestroy, OnChanges, Input } from "@angular/core";
import { Crud } from "../models/global.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Daruser } from "../models/daruser.model";
import { Subscription } from "rxjs";
import { DaruserService } from "../services/daruser.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-daruser",
  templateUrl: "./daruser.component.html",
  styleUrls: ["./daruser.component.scss"]
})
export class DaruserComponent implements OnInit, OnDestroy, OnChanges {
  // Note: Treat @Input as read only, I ran into problems with change detection
  // when I updated the values in the component.
  @Input() did: string;
  @Input() duid: string;
  @Input() crudAction: Crud;
  // Update dummy value with new value each time component is
  // updated from parent component to force OnChange to fire.
  @Input() dummyValue: number;
  _did: string;
  _duid: string;
  _crudAction: Crud;
  Crud = Crud;
  form: FormGroup;
  daruser: Daruser;
  daruser$: Subscription;

  constructor(
    private fb: FormBuilder,
    private daruserService: DaruserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // console.log("daruser onInit");
    this.resetLocalValues();
  }

  ngOnChanges() {
    this.resetLocalValues();
    this.createForm();

    if (this._crudAction == Crud.Update || this._crudAction == Crud.Delete) {
      if (this.daruser$) this.daruser$.unsubscribe();

      this.daruser$ = this.daruserService
        .findById(this._did, this._duid)
        .subscribe(du => {
          this.daruser = du;
          this.form.patchValue(this.daruser);
          console.log("ngOnChanges daruser", this.daruser);
        });
    }
    if (this.form) this.form.patchValue(this.daruser);
    if (this._crudAction == Crud.Update) {
      // Check for validation errors all the time
      for (const field in this.form.controls) {
        this.form.get(field).markAsTouched();
      }
    }
  }

  onFieldUpdate(fieldName: string) {
    if (
      this.form.get(fieldName).valid &&
      this.daruser.id != "" &&
      this._crudAction == this.Crud.Update
    ) {
      let newValue = this.form.get(fieldName).value;
      this.daruserService.fieldUpdate(
        this._did,
        this._duid,
        fieldName,
        newValue
      );
    }
  }

  onCreate() {
    for (const field in this.form.controls) {
      this.daruser[field] = this.form.get(field).value;
    }
    this.daruserService
      .createDaruser(this._did, this._duid, this.daruser)
      .then(docRef => {
        this.snackBar.open("User '" + this.daruser.email + "' created.", "", {
          duration: 2000
        });
        // Reset detail form
        this._duid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error creating user: ", error);
      });
  }

  onDelete() {
    const email = this.daruser.email;
    this.daruserService
      .deleteDaruser(this._did, this._duid)
      .then(() => {
        this.snackBar.open("User '" + email + "' deleted!", "", {
          duration: 2000
        });
        // Reset detail form
        this._duid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error deleting user: ", error);
      });
  }

  resetLocalValues() {
    this._did = this.did;
    this._duid = this.duid;
    this._crudAction = this.crudAction;
    this.daruser = {
      email: ""
    };
  }

  createForm() {
    // Create form group and initialize with  values
    this.form = this.fb.group({
      email: [
        this.daruser.email,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40)
        ]
      ],
      isOwner: [this.daruser.isOwner],
      isStakeholder: [this.daruser.isStakeholder],
      isEvaluator: [this.daruser.isEvaluator],
      isReader: [this.daruser.isReader],
      isVoter: [this.daruser.isVoter]
    });
  }

  ngOnDestroy() {
    if (this.daruser$) this.daruser$.unsubscribe();
  }
}
