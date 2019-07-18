import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-darfolder',
  templateUrl: './darfolder.component.html',
  styleUrls: ['./darfolder.component.scss']
})
export class DarfolderComponent implements OnInit {
  title : string;

  constructor(    private route : ActivatedRoute) { 



  }

  ngOnInit() {
    this.title = this.route.snapshot.data["dar"].title;
  }

}
