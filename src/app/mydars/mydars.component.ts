import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { DarsDataSource } from "../services/dars.datasource";
import { DarStatus, Dar } from "../models/dar.model";
import { MatSort } from "@angular/material";
import { DarService } from "../services/dar.service";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Kvp } from "../models/global.model";
import { enumToMap } from "../shared/utilities";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-mydars",
  templateUrl: "./mydars.component.html",
  styleUrls: ["./mydars.component.scss"]
})
export class MydarsComponent implements OnInit {
  @ViewChild("selectedDarStatus") selectedDarStatus;
  @ViewChild("selectedRole") selectedRole;
  dars: Observable<Dar[]>;
  displayedColumns = ["title", "darStatus", "roles","actions"];
  darStatus = DarStatus;
  darStatuses: Kvp[];
  

  constructor(private darService: DarService, private auth: AuthService) {}

  ngOnInit() {
    this.selectedDarStatus.value = "";
    this.selectedRole.value = "";
    this.updateQuery();

    this.darStatuses = enumToMap(DarStatus);
    //this.dataSource.loadDars("", "title", "asc", 100);
  }

  updateQuery() {
    this.dars = this.darService.findMyDars(
      this.auth.currentUser.uid,
      this.selectedRole.value,
      this.selectedDarStatus.value == ""
        ? undefined
        : this.selectedDarStatus.value,
      100
    );
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
