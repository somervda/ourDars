import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Crud } from "../models/global.model";
import { Dar, DarStatus } from "../models/dar.model";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";
import { DarService } from "../services/dar.service";

@Component({
  selector: "app-darfolder",
  templateUrl: "./darfolder.component.html",
  styleUrls: ["./darfolder.component.scss"]
})
export class DarfolderComponent implements OnInit, OnDestroy {
  // title : string;
  crudAction: Crud;
  dar: Dar;
  dar$$: Subscription;
  Crud = Crud;
  allowUpdate = false;
  DarStatus = DarStatus;

  constructor(
    private auth: AuthService,
    private darService: DarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //this.title = this.route.snapshot.data["dar"].title;
    if (this.route.routeConfig.path == "darfolder/:id") {
      this.crudAction = Crud.Update;
      this.dar = this.route.snapshot.data["dar"];
      this.dar$$ = this.darService.findById(this.dar.id).subscribe(dar => {
        this.dar = dar;
        if (
          this.dar.darStatus == DarStatus.design ||
          this.auth.currentUser.isAdmin
        ) {
          this.allowUpdate = true;
        } else {
          this.allowUpdate = false;
        }
      });
    }
    if (this.route.routeConfig.path == "darfolder/delete/:id") {
      this.crudAction = Crud.Delete;
      this.dar = this.route.snapshot.data["dar"];
      this.allowUpdate = false;
    }
    if (this.route.routeConfig.path == "darfolder/create") {
      this.crudAction = Crud.Create;
      this.allowUpdate = false;
    }
  }

  ngOnDestroy() {
    if (this.dar$$) {
      this.dar$$.unsubscribe();
    }
  }
}
