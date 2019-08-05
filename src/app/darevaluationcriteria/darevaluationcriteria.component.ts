import { CriteriaWeighting } from './../models/darcriteria.model';
import { Component, OnInit, Input } from '@angular/core';
import { Darcriteria } from '../models/darcriteria.model';
import { EvaluationScore } from '../models/darsolution.model';
import { enumToMap } from '../shared/utilities';
import { Kvp } from '../models/global.model';

@Component({
  selector: 'app-darevaluationcriteria',
  templateUrl: './darevaluationcriteria.component.html',
  styleUrls: ['./darevaluationcriteria.component.scss']
})
export class DarevaluationcriteriaComponent implements OnInit {
   @Input() darcriteria : Darcriteria;
   CriteriaWeighting = CriteriaWeighting;
   EvaluationScore = EvaluationScore;
   evaluationScoreItems: Kvp[];

  constructor() { }

  ngOnInit() {
    this.evaluationScoreItems = enumToMap(EvaluationScore);


  }

}
