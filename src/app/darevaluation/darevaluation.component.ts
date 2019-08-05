import { DarcriteriaService } from './../services/darcriteria.service';
import { Component, OnInit, Input } from '@angular/core';
import { Darsolution } from '../models/darsolution.model';
import { Dar } from '../models/dar.model';
import { Observable } from 'rxjs';
import { Darcriteria } from '../models/darcriteria.model';

// One of these components for each solution in a dar being evaluated, this
// in turn shows a list of darevaluationcriteria components where
// the actual evaluation against a criteria is recorded

@Component({
  selector: 'app-darevaluation',
  templateUrl: './darevaluation.component.html',
  styleUrls: ['./darevaluation.component.scss']
})


export class DarevaluationComponent implements OnInit {
  @Input() darsolution : Darsolution;
  @Input() dar : Dar;
  darcriterias: Observable<Darcriteria[]>;
  
  constructor(private darcriteriaservice : DarcriteriaService) { }

  ngOnInit() {
    console.log("darevaluation",this.dar, this.darsolution);
    // get a observable of all darsolutions related to this dar
    this.darcriterias = this.darcriteriaservice.findAllDarcriteria(
      this.dar.id,
      1000
    );
  }

}
