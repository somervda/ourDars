import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { DarsDataSource } from "../services/dars.datasource";
import { DarStatus, Dar } from "../models/dar.model";
import { MatSort } from "@angular/material";
import { DarService } from "../services/dar.service";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-mydars",
  templateUrl: "./mydars.component.html",
  styleUrls: ["./mydars.component.scss"]
})
export class MydarsComponent implements OnInit {
  dars: Observable<Dar[]>;
  displayedColumns = ["title", "darStatus", "description"];
  darStatus = DarStatus;

  constructor(private darService: DarService, private auth: AuthService) {}

  ngOnInit() {
    this.dars = this.darService.findMyDars(
      this.auth.currentUser.uid,
      "",
      undefined,
      20
    );

    //this.dataSource.loadDars("", "title", "asc", 100);
  }

  // ngAfterViewInit(): void {
  //   this.sort.sortChange
  //     .pipe(
  //       tap(() => {
  //         console.log("sort", this.sort);
  //         this.loadDarsPage();
  //       })
  //     )
  //     .subscribe(() => {
  //       console.log("mydars ngOnInit subscribe to sort change");
  //     });
  // }

  // loadDarsPage() {
  //   this.dataSource.loadDars(
  //     "",
  //     this.sort.active,
  //     this.sort.direction == "" ? "asc" : this.sort.direction,
  //     100
  //   );
  // }
}
