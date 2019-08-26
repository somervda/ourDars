import { TeamService } from "./../services/team.service";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { TeamsDataSource } from "../services/teams.datasource";
import { MatPaginator, MatSort, MatTable, MatRow } from "@angular/material";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"]
})
export class TeamsComponent implements OnInit, AfterViewInit {
  dataSource: TeamsDataSource;
  displayedColumns = ["name","description","id"];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.dataSource = new TeamsDataSource(this.teamService);

    this.dataSource.loadTeams("", "name", "asc", 100);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange
      .pipe(
        tap(() => {
          console.log("sort", this.sort);
          this.loadTeamsPage();
        })
      )
      .subscribe();
  }

  loadTeamsPage() {
    this.dataSource.loadTeams(
      "",
      this.sort.active,
      this.sort.direction == "" ? "asc" : this.sort.direction,
      100
    );
  }
}
