import { Component, OnInit, ViewChild } from "@angular/core";
import { DarService } from "../services/dar.service";
import { DarsDataSource } from "../services/dars.datasource";
import { MatSort } from "@angular/material";
import { tap } from "rxjs/operators";
import { DarStatus, Dar } from "../models/dar.model";
import { Kvp } from "../models/global.model";
import { enumToMap } from "../shared/utilities";
import { Observable } from "rxjs";

@Component({
  selector: "app-admin-dars",
  templateUrl: "./admin-dars.component.html",
  styleUrls: ["./admin-dars.component.scss"]
})
export class AdminDarsComponent implements OnInit {
  @ViewChild("titleFilter", { static: false }) titleFilter;
  @ViewChild("selectedDarStatus", { static: true }) selectedDarStatus;
  dataSource: DarsDataSource;
  displayedColumns = ["title", "darStatus", "description", "export", "delete"];
  DarStatus = DarStatus;
  darStatuses: Kvp[];
  dars$: Observable<Dar[]>;

  constructor(private darService: DarService) {}

  ngOnInit() {
    this.darStatuses = enumToMap(DarStatus);
    this.refreshList();
  }

  refreshList() {
    this.dars$ = this.darService.findAllDars(
      "",
      this.selectedDarStatus.value == undefined
        ? 0
        : this.selectedDarStatus.value,
      // this.titleFilter.value,
      // this.selectedDarStatus.value,
      100
    );
  }
}
