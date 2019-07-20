import { DarsolutionService } from './../services/darsolution.service';
import { DarService } from './../services/dar.service';
import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Darsolution } from '../models/darsolution.model';
import { firestore } from "firebase/app";
import { Crud } from '../models/global.model';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-darsolution',
  templateUrl: './darsolution.component.html',
  styleUrls: ['./darsolution.component.scss']
})

export class DarsolutionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() did: string;
  @Input() dsid: string;
  @Input() crudAction: Crud;
  @Input() dummy: any;
  Crud = Crud;
  form: FormGroup;
  darsolution : Darsolution;
  darsolution$ : Subscription;

  constructor(
    private fb: FormBuilder,
    private darService : DarService,
    private darsolutionService : DarsolutionService,
    private snackBar: MatSnackBar
    ) { 

  }

  ngOnInit() {
    console.log("darsolution onInit");
    if (!this.darsolution)
      this.darsolution = { name: "", description: "",evalutionNotes: "" };
    if (!this.crudAction)
      this.crudAction = Crud.Create;
    // if (this.crudAction == Crud.Update || this.crudAction == Crud.Delete)
    // {
    //   // load darsolution from firestore
    //   this.darsolution$ = this.darsolutionService.findById(this.did,this.dsid)
    //   .subscribe(ds => {
    //     console.log("darsolution subscription",ds);
    //     this.darsolution = ds;
    //   });
    // }

  // Create form group and initialize with  values
  this.form = this.fb.group({
    name: [this.darsolution.name, [Validators.required,  Validators.minLength(10),Validators.maxLength(40)]],
    description: [
      this.darsolution.description,
      [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]
    ],
    evalutionNotes: [
      this.darsolution.evalutionNotes,
      [ Validators.maxLength(1000)]
    ]
  });
  // for (const field in this.form.controls) {
  //   this.form.get(field).markAsTouched();
  // }
  }

  ngOnChanges() {
    console.log("ngOnChanges did:",this.did," dsid:",this.dsid, this.crudAction);
    if (this.crudAction == Crud.Update || this.crudAction == Crud.Delete) {
      if (this.darsolution$) this.darsolution$.unsubscribe();

      this.darsolution$ = this.darsolutionService.findById(this.did,this.dsid)
      .subscribe(ds => {
        console.log("darsolution subscription",ds);
        this.darsolution = ds;
        this.form.patchValue(this.darsolution);
      });
    }
    else {

      this.darsolution = { name: "", description: "",evalutionNotes: "" };
      this.form.patchValue(this.darsolution);
    }

  }

  onFieldUpdate(fieldName: string, toType?: string) {
    if (
      this.form.get(fieldName).valid &&
      this.darsolution.id != "" 
    ) {
      let newValue = this.form.get(fieldName).value;
      // Do any type conversions before storing value
      if (toType && toType == "Timestamp")
        newValue = firestore.Timestamp.fromDate(
          this.form.get(fieldName).value
        );
      this.darsolutionService.fieldUpdate(this.did,this.dsid, fieldName, newValue);
    }
  }

  onCreate () {
    console.log("onCreate",this.dummy);
    for (const field in this.form.controls) {
      this.darsolution[field] = this.form.get(field).value;
    }
    this.darsolutionService.createDarsolution(this.did,this.darsolution).then(docRef => {
      this.snackBar.open("Solution '" + this.darsolution.name + "' created.", "", {
        duration: 2000
      });
      this.crudAction = Crud.Update;
      this.dsid = docRef.id;
    })
    .catch(function(error) {
      console.error("Error creating solution: ", error);
    });
  }

  onDelete() {
    console.log("onDelete");
    const name = this.darsolution.name;
    this.darsolutionService
      .deleteDarsolution(this.did,this.dsid)
      .then(() => {
        this.snackBar.open("Solution '" + name + "' deleted!", "", {
          duration: 2000
        });
        this.dsid = "";
      })
      .catch(function(error) {
        console.error("Error deleting solution: ", error);
      });
  }

  ngOnDestroy() {
    if (this.darsolution$) this.darsolution$.unsubscribe();
  }





}
