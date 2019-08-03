import { DarService } from "./../services/dar.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute } from "@angular/router";
import { TeamService } from "../services/team.service";
import { Observable, Subscription } from "rxjs";
import { Team } from "../models/team.model";

@Component({
  selector: "app-darview",
  templateUrl: "./darview.component.html",
  styleUrls: ["./darview.component.scss"]
})
export class DarviewComponent implements OnInit, OnDestroy {
  dar: Dar;
  DarStatus = DarStatus;
  DarMethod = DarMethod;
  team: Observable<Team>;
  dar$: Subscription;
  did: string;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private darService: DarService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    this.did = this.dar.id;

    this.dar$ = this.darService.findById(this.did).subscribe(dar => {
      this.dar = dar;
      this.team = this.teamService.findById(this.dar.tid);
    });
  }

  ngOnDestroy() {
    if (this.dar$) this.dar$.unsubscribe();
  }
}
