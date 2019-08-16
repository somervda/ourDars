import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notauthorized',
  templateUrl: './notauthorized.component.html',
  styleUrls: ['./notauthorized.component.scss']
})
export class NotauthorizedComponent implements OnInit {
   
  queryParams$ : Observable<Params>;

  constructor(private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.queryParams$ = this.activatedRoute.queryParams;
    }

}
