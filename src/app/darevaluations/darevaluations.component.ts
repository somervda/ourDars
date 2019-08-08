import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Darsolution } from '../models/darsolution.model';
import { Dar } from '../models/dar.model';
import { ActivatedRoute } from '@angular/router';
import { DarsolutionService } from '../services/darsolution.service';

@Component({
  selector: 'app-darevaluations',
  templateUrl: './darevaluations.component.html',
  styleUrls: ['./darevaluations.component.scss']
})
export class DarevaluationsComponent implements OnInit {

  darsolutions$: Observable<Darsolution[]>;
  dar : Dar;


  constructor(
    private route: ActivatedRoute,
    private darsolutionservice: DarsolutionService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    console.log("darevaluations",this.dar);
    // get a observable of all darsolutions related to this dar
    this.darsolutions$ = this.darsolutionservice.findAllDarsolutions(
      this.dar.id,
      100
    );
  }



}
