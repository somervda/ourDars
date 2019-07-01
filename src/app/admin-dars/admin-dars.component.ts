import { Component, OnInit } from '@angular/core';
import { DarService } from '../services/dar.service';

@Component({
  selector: 'app-admin-dars',
  templateUrl: './admin-dars.component.html',
  styleUrls: ['./admin-dars.component.scss']
})
export class AdminDarsComponent implements OnInit {

  constructor(private darService: DarService) { }

  ngOnInit() {
  }

}
