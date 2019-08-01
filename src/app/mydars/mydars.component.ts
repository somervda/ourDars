import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { DarsDataSource } from "../services/dars.datasource";
import { DarStatus } from "../models/dar.model";
import { MatSort } from "@angular/material";
import { DarService } from "../services/dar.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-mydars",
  templateUrl: "./mydars.component.html",
  styleUrls: ["./mydars.component.scss"]
})
export class MydarsComponent implements OnInit, AfterViewInit {
  dataSource: DarsDataSource;
  displayedColumns = ["title", "darStatus", "description"];
  darStatus = DarStatus;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private darService: DarService) {}

  ngOnInit() {
    this.dataSource = new DarsDataSource(this.darService);

    this.dataSource.loadDars("", "title", "asc", 100);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange
      .pipe(
        tap(() => {
          console.log("sort", this.sort);
          this.loadDarsPage();
        })
      )
      .subscribe(() => {
        console.log("mydars ngOnInit subscribe to sort change");
      });
  }

  loadDarsPage() {
    this.dataSource.loadDars(
      "",
      this.sort.active,
      this.sort.direction == "" ? "asc" : this.sort.direction,
      100
    );
  }
}
