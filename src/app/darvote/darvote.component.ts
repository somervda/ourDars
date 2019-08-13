import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Darsolution } from "../models/darsolution.model";
import { Dar, DarMethod } from "../models/dar.model";
import { DarsolutionService } from "../services/darsolution.service";
import { ActivatedRoute } from "@angular/router";
import { DarService } from "../services/dar.service";
import { DaruserService } from "../services/daruser.service";
import { AuthService } from "../services/auth.service";
import { Daruser } from "../models/daruser.model";

@Component({
  selector: "app-darvote",
  templateUrl: "./darvote.component.html",
  styleUrls: ["./darvote.component.scss"]
})
export class DarvoteComponent implements OnInit, OnDestroy {
  darsolutions: Darsolution[];
  darsolutions$$: Subscription;
  dar: Dar;
  daruser$$: Subscription;
  daruser: Daruser;

  DarMethod = DarMethod;

  constructor(
    private darsolutionService: DarsolutionService,
    private route: ActivatedRoute,
    private daruserService: DaruserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    console.log("DarvoteComponent", this.dar);
    
    this.darsolutions$$ = this.darsolutionService
      .findAllDarsolutions(this.dar.id, 1000)
      .subscribe(s => (this.darsolutions = s));

    this.daruser$$ = this.daruserService
      .findById(this.dar.id, this.auth.currentUser.uid)
      .subscribe(u => {
        this.daruser = u;
        if (!this.daruser.solutionVote)
          this.daruser.solutionVote = { dsid: "", name: "[No Vote]" };
      });
  }

  onVote(selectedValue) {
    console.log("onVote", selectedValue);
    // Resolve name to add to solutionVote info
    const solution = this.darsolutions.find(s => s.id == selectedValue);
    let name = "[No Vote]";
    if (solution) name = solution.name;

    const solutionVote = { dsid: selectedValue, name: name };
    this.daruserService.fieldUpdate(
      this.dar.id,
      this.auth.currentUser.uid,
      "solutionVote",
      solutionVote
    );
  }

  ngOnDestroy() {
    if (this.daruser$$) this.daruser$$.unsubscribe();
    if (this.darsolutions$$) this.darsolutions$$.unsubscribe();
  }
}
