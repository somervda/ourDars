import { Component, OnInit, OnDestroy, OnChanges, Input } from "@angular/core";
import { Crud, Kvp } from "../models/global.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Darcriteria, CriteriaWeighting } from "../models/darcriteria.model";
import { Subscription } from "rxjs";
import { DarcriteriaService } from "../services/darcriteria.service";
import { MatSnackBar } from "@angular/material";
import { enumToMap } from "../shared/utilities";

@Component({
  selector: "app-darcriteria",
  templateUrl: "./darcriteria.component.html",
  styleUrls: ["./darcriteria.component.scss"]
})
export class DarcriteriaComponent implements OnInit, OnDestroy, OnChanges {
  // Note: Treat @Input as read only, I ran into problems with change detection
  // when I updated the values in the component.
  @Input() did: string;
  @Input() dcid: string;
  @Input() crudAction: Crud;
  // Update dummy value with new value each time component is
  // updated from parent component to force OnChange to fire.
  @Input() dummyValue: number;
  _did: string;
  _dcid: string;
  _crudAction: Crud;
  Crud = Crud;
  form: FormGroup;
  darcriteria: Darcriteria;
  darcriteria$$: Subscription;
  criteriaWeightings: Kvp[];

  constructor(
    private fb: FormBuilder,
    private darcriteriaService: DarcriteriaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.criteriaWeightings = enumToMap(CriteriaWeighting);
    console.log("darsolution onInit", this.criteriaWeightings);
    this.resetLocalValues();
  }

  ngOnChanges() {
    this.resetLocalValues();
    this.createForm();

    if (this._crudAction == Crud.Update || this._crudAction == Crud.Delete) {
      if (this.darcriteria$$) this.darcriteria$$.unsubscribe();

      this.darcriteria$$ = this.darcriteriaService
        .findById(this._did, this._dcid)
        .subscribe(dc => {
          this.darcriteria = dc;
          this.form.patchValue(this.darcriteria);
        });
    }
    if (this.form) this.form.patchValue(this.darcriteria);
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
      this.darcriteria.id != "" &&
      this._crudAction == this.Crud.Update
    ) {
      let newValue = this.form.get(fieldName).value;
      this.darcriteriaService.fieldUpdate(
        this._did,
        this._dcid,
        fieldName,
        newValue
      );
    }
  }

  onCreate() {
    for (const field in this.form.controls) {
      this.darcriteria[field] = this.form.get(field).value;
    }
    this.darcriteriaService
      .createDarcriteria(this._did, this.darcriteria)
      .then(docRef => {
        this.snackBar.open(
          "Criteria '" + this.darcriteria.name + "' created.",
          "",
          {
            duration: 2000
          }
        );
        // Reset detail form
        this._dcid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error creating criteria: ", error);
      });
  }

  onDelete() {
    const name = this.darcriteria.name;
    this.darcriteriaService
      .deleteDarcriteria(this._did, this._dcid)
      .then(() => {
        this.snackBar.open("Criteria '" + name + "' deleted!", "", {
          duration: 2000
        });
        // Reset detail form
        this._dcid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error deleting criteria: ", error);
      });
  }

  resetLocalValues() {
    this._did = this.did;
    this._dcid = this.dcid;
    this._crudAction = this.crudAction;
    this.darcriteria = {
      name: "",
      description: "",
      weighting: CriteriaWeighting.Desirable
    };
  }

  createForm() {
    // Create form group and initialize with  values
    this.form = this.fb.group({
      name: [
        this.darcriteria.name,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40)
        ]
      ],
      description: [
        this.darcriteria.description,
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000)
        ]
      ],
      weighting: [this.darcriteria.weighting, Validators.required]
    });
  }

  ngOnDestroy() {
    if (this.darcriteria$$) this.darcriteria$$.unsubscribe();
  }
}
