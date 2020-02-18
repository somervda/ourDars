import { DarsolutionService } from "./../services/darsolution.service";
import { DarService } from "./../services/dar.service";
import { Component, OnInit, Input, OnDestroy, OnChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Darsolution } from "../models/darsolution.model";
import { firestore } from "firebase/app";
import { Crud } from "../models/global.model";
import { Observable, Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-darsolution",
  templateUrl: "./darsolution.component.html",
  styleUrls: ["./darsolution.component.scss"]
})
export class DarsolutionComponent implements OnInit, OnDestroy, OnChanges {
  // Note: Treat @Input as read only, I ran into problems with change detection
  // when I updated the values in the component.
  @Input() did: string;
  @Input() dsid: string;
  @Input() crudAction: Crud;
  // Update dummy value with new value each time component is
  // updated from parent component to force OnChange to fire.
  @Input() dummyValue: number;
  _did: string;
  _dsid: string;
  _crudAction: Crud;
  Crud = Crud;
  form: FormGroup;
  darsolution: Darsolution;
  darsolution$$: Subscription;

  constructor(
    private fb: FormBuilder,
    private darService: DarService,
    private darsolutionService: DarsolutionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // console.log("darsolution onInit");
    this.resetLocalValues();
  }

  ngOnChanges() {
    this.resetLocalValues();
    this.createForm();

    if (this._crudAction == Crud.Update || this._crudAction == Crud.Delete) {
      if (this.darsolution$$) this.darsolution$$.unsubscribe();

      this.darsolution$$ = this.darsolutionService
        .findById(this._did, this._dsid)
        .subscribe(ds => {
          this.darsolution = ds;
          this.form.patchValue(this.darsolution);
        });
    }
    if (this.form) this.form.patchValue(this.darsolution);
    if (this._crudAction == Crud.Update) {
      // Check for validation errors all the time
      for (const field in this.form.controls) {
        this.form.get(field).markAsTouched();
      }
    }
  }

  onFieldUpdate(fieldName: string, toType?: string) {
    if (
      this.form.get(fieldName).valid &&
      this.darsolution.id != "" &&
      this._crudAction == this.Crud.Update
    ) {
      let newValue = this.form.get(fieldName).value;
      // Do any type conversions before storing value
      if (toType && toType == "Timestamp")
        newValue = firestore.Timestamp.fromDate(this.form.get(fieldName).value);
      this.darsolutionService.fieldUpdate(
        this._did,
        this._dsid,
        fieldName,
        newValue
      );
    }
  }

  onCreate() {
    for (const field in this.form.controls) {
      this.darsolution[field] = this.form.get(field).value;
    }
    this.darsolutionService
      .createDarsolution(this._did, this.darsolution)
      .then(docRef => {
        this.snackBar.open(
          "Solution '" + this.darsolution.name + "' created.",
          "",
          {
            duration: 2000
          }
        );
        // Reset detail form
        this._dsid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error creating solution: ", error);
      });
  }

  onDelete() {
    const name = this.darsolution.name;
    this.darsolutionService
      .deleteDarsolution(this._did, this._dsid)
      .then(() => {
        this.snackBar.open("Solution '" + name + "' deleted!", "", {
          duration: 2000
        });
        // Reset detail form
        this._dsid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error deleting solution: ", error);
      });
  }

  resetLocalValues() {
    this._did = this.did;
    this._dsid = this.dsid;
    this._crudAction = this.crudAction;
    this.darsolution = { name: "", description: "", evaluationNotes: "" };
  }

  createForm() {
    // Create form group and initialize with  values
    this.form = this.fb.group({
      name: [
        this.darsolution.name,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40)
        ]
      ],
      description: [
        this.darsolution.description,
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000)
        ]
      ],
      evaluationNotes: [
        this.darsolution.evaluationNotes,
        [Validators.maxLength(1000)]
      ]
    });
  }

  ngOnDestroy() {
    if (this.darsolution$$) this.darsolution$$.unsubscribe();
  }
}
