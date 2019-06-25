import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  team : Team;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.team = this.route.snapshot.data["team"];
    console.log("this.team", this.team);
  }

}
