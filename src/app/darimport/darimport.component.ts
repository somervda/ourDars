import { Component, OnInit, ViewChild } from "@angular/core";
import { DarService } from "../services/dar.service";
import { DarcriteriaService } from "../services/darcriteria.service";

@Component({
  selector: "app-darimport",
  templateUrl: "./darimport.component.html",
  styleUrls: ["./darimport.component.scss"]
})
export class DarimportComponent implements OnInit {
  @ViewChild("txtJSON", { static: true }) txtJSON;
  newDarRef: firebase.firestore.DocumentReference;
  did = {} as oldNew;
  dcids = [] as oldNew[];

  constructor(
    private darService: DarService,
    private darcriteriaService: DarcriteriaService
  ) {}

  ngOnInit() {}

  async onImport() {
    console.log("JSON:", this.txtJSON.nativeElement.value);
    const darJson = JSON.parse(this.txtJSON.nativeElement.value);
    console.log("darJson:", darJson);

    // As dar documents are imported , update the document Ids

    // Create the dar
    this.did.old = darJson.dar.id;
    delete darJson.dar.id;
    await this.darService
      .createDar(darJson.dar)
      .then(darRef => {
        console.log("darRef", darRef);
        this.newDarRef = darRef;
        this.did.new = this.newDarRef.id;
      })
      .catch(error => console.error("Error creating Dar:", error));

    // Create criteria
    darJson.darCriteria.forEach(async darCriteria => {
      let dcid: oldNew = { old: darCriteria.id, new: "" };
      delete darCriteria.id;
      await this.darcriteriaService
        .createDarcriteria(this.did.new, darCriteria)
        .then(darcriteriaRef => {
          console.log("darcriteriaRef", darcriteriaRef);
          dcid.new = darcriteriaRef.id;
          this.dcids.push(dcid);
        })
        .catch(error =>
          console.error("Error creating Darcriteria:", dcid, error)
        );
    });
  }
}

interface oldNew {
  old: any;
  new: any;
}
