import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dar } from '../models/dar.model';
import { Observable } from 'rxjs';
import { Darsolution } from '../models/darsolution.model';
import { DarsolutionService } from '../services/darsolution.service';

@Component({
  selector: 'app-darexport',
  templateUrl: './darexport.component.html',
  styleUrls: ['./darexport.component.scss']
})
export class DarexportComponent implements OnInit {
  dar : Dar;
  darSolutions$ : Observable<Darsolution[]>;

  constructor(private route : ActivatedRoute,
    private darsolutionService : DarsolutionService
    ) { }

  ngOnInit( ) {
    this.dar = this.route.snapshot.data["dar"];
    this.darSolutions$ = this.darsolutionService.findAllDarsolutions(this.dar.id,1000);


  }

}
