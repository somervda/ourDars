import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Team } from "../models/team.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"]
})
export class TeamComponent implements OnInit {
  @ViewChild("teamDescription") teamDescription: ElementRef;
  team: Team;
  isCreate = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.isCreate = this.route.routeConfig.path == "team/create";
    console.log("team onInit", this.isCreate);
    if (this.isCreate) {
      this.team = { name: "", description: "" };
    } else {
      this.team = this.route.snapshot.data["team"];
    }
    console.log("this.team", this.team);
  }

  onDescriptionUpdate() {
    console.log(
      "onDescriptionUpdate",
      this.teamDescription.nativeElement.value
    );
  }
}
