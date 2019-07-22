import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Crud } from '../models/global.model';
import { Dar } from '../models/dar.model';

@Component({
  selector: 'app-darfolder',
  templateUrl: './darfolder.component.html',
  styleUrls: ['./darfolder.component.scss']
})
export class DarfolderComponent implements OnInit {
  // title : string;
  crudAction : Crud;
  dar: Dar;
  Crud = Crud;

  constructor(    private route : ActivatedRoute) { 



  }

  ngOnInit() {
    //this.title = this.route.snapshot.data["dar"].title;
    if (this.route.routeConfig.path == "darfolder/:id")
    {
      this.crudAction = Crud.Update;
      this.dar = this.route.snapshot.data["dar"];
    }
    if (this.route.routeConfig.path == "darfolder/delete/:id")
    {
      this.crudAction = Crud.Delete;
      this.dar = this.route.snapshot.data["dar"];
    }
    if (this.route.routeConfig.path == "darfolder/create")
      this.crudAction = Crud.Create;

  }

}
