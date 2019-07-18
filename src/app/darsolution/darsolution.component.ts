import { DarsolutionService } from './../services/darsolution.service';
import { DarService } from './../services/dar.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Darsolution } from '../models/darsolution.model';
import { firestore } from "firebase/app";
import { Crud } from '../models/global.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-darsolution',
  templateUrl: './darsolution.component.html',
  styleUrls: ['./darsolution.component.scss']
})
export class DarsolutionComponent implements OnInit, OnDestroy {
  @Input() did: string;
  @Input() dsid: string;
  @Input() crudAction: Crud;
  Crud = Crud;
  form: FormGroup;
  darsolution : Darsolution;
  darsolution$ : Subscription;

  constructor(
    private fb: FormBuilder,
    private darService : DarService,
    private darsolutionService : DarsolutionService
    ) { 

  }

  ngOnInit() {
    if (!this.darsolution)
      this.darsolution = { name: "", description: "",evalutionNotes: "" };
    if (!this.crudAction)
      this.crudAction = Crud.Create;
    if (this.crudAction == Crud.Update || this.crudAction == Crud.Delete)
    {
      // load darsolution from firestore
      this.darsolution$ = this.darsolutionService.findById(this.did,this.dsid)
      .subscribe(ds => {
        this.darsolution = ds;
      });
    }

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
  for (const field in this.form.controls) {
    this.form.get(field).markAsTouched();
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
      this.darService.fieldUpdate(this.darsolution.id, fieldName, newValue);
    }
  }

  onCreate () {
    console.log("onCreate");
  }

  onDelete() {
    console.log("onDelete");
  }

  ngOnDestroy() {
    if (this.darsolution$) this.darsolution$.unsubscribe();
  }





}
