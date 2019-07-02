import { Component, OnInit, NgZone } from "@angular/core";
import { Dar, DarStatus, DarMethod } from "../models/dar.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DarService } from "../services/dar.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Crud } from "../models/global.model";
import { enumToMap } from "../shared/utilities";

@Component({
  selector: "app-dar",
  templateUrl: "./dar.component.html",
  styleUrls: ["./dar.component.scss"]
})
export class DarComponent implements OnInit {
  dar: Dar;
  crudAction: Crud;
  crud = Crud;
  object = Object;
  darMethodAsMap: { key: number; value: string }[];
  darForm: FormGroup;

  constructor(
    private darService: DarService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
    this.crudAction = Crud.Update;
    if (this.route.routeConfig.path == "dar/delete/:id")
      this.crudAction = Crud.Delete;
    if (this.route.routeConfig.path == "dar/create")
      this.crudAction = Crud.Create;

    // console.log("team onInit", this.crudAction);
    if (this.crudAction == Crud.Create) {
      this.dar = {
        title: "",
        description: "",
        darStatus: DarStatus.created,
        darMethod: DarMethod.Process
      };
    } else {
      this.dar = this.route.snapshot.data["dar"];
    }

    // Create form group and initialize with team values
    this.darForm = this.fb.group({
      title: [this.dar.title, [Validators.required]],
      description: [
        this.dar.description,
        [Validators.required, Validators.minLength(10)]
      ],
      darStatus: [this.dar.darStatus],
      darMethod: [this.dar.darMethod]
    });

    this.darMethodAsMap = enumToMap(DarMethod);

    // let map: { key: number; value: string }[] = [];

    // for (var n in DarMethod) {
    //   if (typeof DarMethod[n] === "number") {
    //     map.push({ key: <any>DarMethod[n], value: n });
    //   }
    // }

    // console.log("Map", enumToMap(DarStatus));
  }

  createDar() {}
  deleteDar() {}
  onTitleUpdate() {}
  onDescriptionUpdate() {}
}
