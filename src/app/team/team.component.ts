import { Component, OnInit,  NgZone } from "@angular/core";
import { Team } from "../models/team.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TeamService } from "../services/team.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Crud } from '../models/global.model';

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"]
})


export class TeamComponent implements OnInit {

  team: Team;
  crudAction : Crud ;
  // Declare an instance of crudCheck enum to use for checking crudAction value
  crudCheck = Crud;

  teamForm: FormGroup;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router : Router
  ) {}

  ngOnInit() {
    this.crudAction=Crud.Update;
    if (this.route.routeConfig.path == "team/delete/:id")
      this.crudAction=Crud.Delete;
    if (this.route.routeConfig.path == "team/create")
      this.crudAction=Crud.Create
      
    // console.log("team onInit", this.crudAction);
    if (this.crudAction == Crud.Create) {
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
    if (this.crudAction != Crud.Create) {
      this.name.markAsTouched();
      this.description.markAsTouched();
    }
  }

  // Getters
  get name() {
    return this.teamForm.get("name");
  }

  get description() {
    return this.teamForm.get("description");
  }

  createTeam() {
    this.team.name = this.name.value;
    this.team.description = this.description.value;
    console.log("create team", this.team);
    this.teamService
      .createTeam(this.team)
      .then(docRef => {
        //console.log("Document written with ID: ", docRef.id);
        this.team.id = docRef.id;
        this.crudAction = Crud.Update;
        this.snackBar.open("Team '" + this.team.name + "' created.", "", {
          duration: 2000
        });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    // console.log("create team", this.team);
  }

  deleteTeam() {
    console.log("delete", this.team.id);

    this.teamService
      .deleteTeam(this.team.id)
      .then(() =>{
        this.snackBar.open("Team '" + this.team.name + "' deleted!", "", {
          duration: 2000
        });
        this.ngZone.run(() => this.router.navigateByUrl("/teams"));

      })
      .catch(function(error) {
        console.error("Error deleting team: ", error);
      });
  }

  onDescriptionUpdate() {
    if (this.description.valid && this.team.id != "" && this.crudAction != Crud.Delete)
      this.teamService.fieldUpdate(
        this.team.id,
        "description",
        this.description.value
      );
  }
  onNameUpdate() {
    if (this.name.valid && this.team.id != ""  && this.crudAction != Crud.Delete)
      this.teamService.fieldUpdate(this.team.id, "name", this.name.value);
  }
}
