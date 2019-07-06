import { Component, OnInit,  NgZone } from "@angular/core";
import { Team } from "../models/team.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TeamService } from "../services/team.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Crud } from '../models/global.model';
import { firestore } from "firebase/app";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"]
})


export class TeamComponent implements OnInit {

  team: Team;
  crudAction : Crud ;
  // Declare an instance of crud enum to use for checking crudAction value
  Crud = Crud;

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
    for (const field in this.teamForm.controls) {
      this.teamForm.get(field).markAsTouched();
    }
  }
  }

  onCreate() {
    for (const field in this.teamForm.controls) {
      this.team[field] = this.teamForm.get(field).value;
    }
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

  onDelete() {
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

  onFieldUpdate(fieldName: string, toType ?: string) {
    if (
      this.teamForm.get(fieldName).valid &&
      this.team.id != "" &&
      this.crudAction != Crud.Delete
    ){
      let newValue = this.teamForm.get(fieldName).value;
      // Do any type conversions before storing value
      if (toType && toType == "Timestamp")
        newValue = firestore.Timestamp.fromDate(this.teamForm.get(fieldName).value);
      this.teamService.fieldUpdate(
        this.team.id,
        fieldName,
        newValue
      );
    }
  }
}
