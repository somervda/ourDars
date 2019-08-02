import { Component, OnInit } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute } from "@angular/router";
import { TeamService } from "../services/team.service";
import { Observable } from "rxjs";
import { Team } from "../models/team.model";

@Component({
  selector: "app-darview",
  templateUrl: "./darview.component.html",
  styleUrls: ["./darview.component.scss"]
})
export class DarviewComponent implements OnInit {
  dar: Dar;
  DarStatus = DarStatus;
  DarMethod = DarMethod;
  team: Observable<Team>;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    this.team = this.teamService.findById(this.dar.tid);
  }
}
