import { Component, OnInit, ViewChild } from "@angular/core";
import { DarService } from "../services/dar.service";
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
  @ViewChild("titleFilter") titleFilter;
  @ViewChild("selectedDarStatus", { static: true }) selectedDarStatus;
  displayedColumns = ["title", "darStatus", "description", "export", "delete"];
  DarStatus = DarStatus;
  darStatuses: Kvp[];
  dars$: Observable<Dar[]>;

  constructor(private darService: DarService) {}

  ngOnInit() {
    this.darStatuses = enumToMap(DarStatus);
    this.refreshList("", 0);
  }

  onFilterChange() {
    this.refreshList(
      this.titleFilter.nativeElement.value == undefined
        ? ""
        : this.titleFilter.nativeElement.value,
      this.selectedDarStatus.value == undefined
        ? 0
        : this.selectedDarStatus.value
    );
  }

  refreshList(title: string, darStatus: number) {
    this.dars$ = this.darService.findAllDars(title, darStatus, 100);
  }
}
