import { CriteriaWeighting } from './../models/darcriteria.model';
import { Component, OnInit, Input } from '@angular/core';
import { Darcriteria } from '../models/darcriteria.model';

@Component({
  selector: 'app-darevaluationcriteria',
  templateUrl: './darevaluationcriteria.component.html',
  styleUrls: ['./darevaluationcriteria.component.scss']
})
export class DarevaluationcriteriaComponent implements OnInit {
   @Input() darcriteria : Darcriteria;
   CriteriaWeighting = CriteriaWeighting;

  constructor() { }

  ngOnInit() {


  }

}
