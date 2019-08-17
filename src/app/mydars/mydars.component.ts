import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { DarsDataSource } from "../services/dars.datasource";
import { DarStatus, Dar } from "../models/dar.model";
import { MatSort } from "@angular/material";
import { DarService } from "../services/dar.service";
import { tap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Kvp } from "../models/global.model";
import { enumToMap } from "../shared/utilities";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-mydars",
  templateUrl: "./mydars.component.html",
  styleUrls: ["./mydars.component.scss"]
})
export class MydarsComponent implements OnInit, OnDestroy {
  @ViewChild("selectedDarStatus") selectedDarStatus;
  @ViewChild("selectedRole") selectedRole;
  dars$: Observable<Dar[]>;
  displayedColumns = ["title", "darStatus", "roles", "actions"];
  darStatus = DarStatus;
  darStatuses: Kvp[];
  user$$: Subscription;
  uid: string;

  constructor(private darService: DarService, private auth: AuthService) {}

  ngOnInit() {
    console.log("mydars   ngOnInit");
    this.selectedDarStatus.value = "";
    this.selectedRole.value = "";
    this.updateQuery();

    this.darStatuses = enumToMap(DarStatus);
    //this.dataSource.loadDars("", "title", "asc", 100);
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
    if (this.user$$) this.user$$.unsubscribe();
    this.user$$ = this.auth.user$.subscribe(u => {
      this.dars$ = this.darService.findMyDars(
        u.uid,
        this.selectedRole.value,
        this.selectedDarStatus.value == ""
          ? undefined
          : this.selectedDarStatus.value,
        100
      );
    });
  }

  ngOnDestroy() {
    if (this.user$$) this.user$$.unsubscribe();
  }
}
