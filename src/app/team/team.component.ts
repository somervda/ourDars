import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Team } from "../models/team.model";
import { ActivatedRoute } from "@angular/router";
import { TeamService } from "../services/team.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"]
})
export class TeamComponent implements OnInit {
  // @ViewChild("teamDescription") teamDescription: ElementRef;
  // @ViewChild(NgForm) frmMain: NgForm;
  //name = new FormControl("", [Validators.required]);
  team: Team;
  isCreate = false;

  teamForm: FormGroup;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isCreate = this.route.routeConfig.path == "team/create";
    // console.log("team onInit", this.isCreate);
    if (this.isCreate) {
      this.team = { name: "", description: "" };
    } else {
      this.team = this.route.snapshot.data["team"];
    }

    // Create form group and initalize with team values
    this.teamForm = this.fb.group({
      name: [this.team.name, [Validators.required]],
      description: [
        this.team.description,
        [Validators.required, Validators.minLength(10)]
      ]
    });

    // Mark all fields as touched to trigger validation on initial entry to the fields
    this.name.markAsTouched();
    this.description.markAsTouched();
  }

  // Getters
  get name() {
    return this.teamForm.get("name");
  }

  get description() {
    return this.teamForm.get("description");
  }

  onDescriptionUpdate() {
    if (this.description.valid)
      this.teamService.fieldUpdate(
        this.team.id,
        "description",
        this.description.value
      );
  }
  onNameUpdate() {
    if (this.name.valid)
      this.teamService.fieldUpdate(this.team.id, "name", this.name.value);
  }
}
