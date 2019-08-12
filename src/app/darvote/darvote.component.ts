import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Darsolution } from '../models/darsolution.model';
import { Dar } from '../models/dar.model';
import { DarsolutionService } from '../services/darsolution.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-darvote',
  templateUrl: './darvote.component.html',
  styleUrls: ['./darvote.component.scss']
})
export class DarvoteComponent implements OnInit {
  // @ViewChild("solutionSelector") solutionSelector;
  darsolutions$: Observable<Darsolution[]>;
  dar : Dar;

  constructor(
    private darsolutionService : DarsolutionService,
    private route : ActivatedRoute) { }

  ngOnInit() {
    if (this.route.routeConfig.path == "darvote/:id")
    {
      this.dar = this.route.snapshot.data["dar"];
    }
    console.log("DarvoteComponent", this.dar);
    this.darsolutions$ = this.darsolutionService.findAllDarsolutions(
      this.dar.id,
      1000
    );
  }

  onSolutionSelection() {

  }

}
