import { Subscription,  Observable } from 'rxjs';
import { DarsolutionService } from './../services/darsolution.service';
import { DarService } from './../services/dar.service';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Dar } from '../models/dar.model';
import { Darsolution } from '../models/darsolution.model';
import { Crud } from '../models/global.model';

@Component({
  selector: 'app-darsolutions',
  templateUrl: './darsolutions.component.html',
  styleUrls: ['./darsolutions.component.scss']
})
export class DarsolutionsComponent implements OnInit , OnDestroy{
  dar : Dar;
  darsolutions$ : Subscription;
  darsolutions : Observable<Darsolution[]>;
  displayedColumns: string[] = ['name','id'];
  dsid : string;
  crudAction = Crud.Update;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router,
    private darsolutionservice : DarsolutionService) { }

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    // get a observable of all darsolutions related to this dar
    this.darsolutions = this.darsolutionservice.findAllDarsolutions(this.dar.id,100);
    console.log("darsolutions$",this.darsolutions$);
  }

  selectSolution(dsid : string) {
    this.crudAction = Crud.Update;
    this.dsid = dsid;
    console.log("selectSolution"," crudAction:",this.crudAction," did:",this.dar.id," dsid:",this.dsid);

  }

  selectDeleteSolution(dsid : string) {
    this.crudAction = Crud.Delete;
    this.dsid = dsid;

  }

  ngOnDestroy() {
    console.log("unsubscribe darsolutions",this.darsolutions$);
    if (this.darsolutions$) this.darsolutions$.unsubscribe();
  }

}
