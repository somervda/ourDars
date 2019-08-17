import { Component, OnInit, ViewChild } from "@angular/core";
import { DarStatus, Dar } from "../models/dar.model";
import { DarService } from "../services/dar.service";
import { switchMap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Kvp } from "../models/global.model";
import { enumToMap } from "../shared/utilities";

@Component({
  selector: "app-mydars",
  templateUrl: "./mydars.component.html",
  styleUrls: ["./mydars.component.scss"]
})
export class MydarsComponent implements OnInit {
  @ViewChild("selectedDarStatus") selectedDarStatus;
  @ViewChild("selectedRole") selectedRole;
  dars$: Observable<Dar[]>;
  displayedColumns = ["title", "darStatus", "roles", "actions"];
  darStatus = DarStatus;
  darStatuses: Kvp[];

  constructor(private darService: DarService, private auth: AuthService) {}

  ngOnInit() {
    console.log("mydars   ngOnInit");
    this.selectedDarStatus.value = "";
    this.selectedRole.value = "";
    this.updateQuery();
    this.darStatuses = enumToMap(DarStatus);
  }

  updateQuery() {
    // console.log(
    //   "mydars   updateQuery",
    //   this.uid,
    //   "-",
    //   this.selectedRole.value,
    //   "-",
    //   this.selectedDarStatus.value
    // );

    // Use switchMap to wait for uid to be available before
    // creating dars$ observable - needed when doing a browser refresh (auth gets delayed)
    this.dars$ = this.auth.user$.pipe(
      switchMap(
        u =>
          (this.dars$ = this.darService.findMyDars(
            u.uid,
            this.selectedRole.value,
            this.selectedDarStatus.value == ""
              ? undefined
              : this.selectedDarStatus.value,
            100
          ))
      )
    );
  }
}
