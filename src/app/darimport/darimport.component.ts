import { DarsolutionService } from "./../services/darsolution.service";
import { DarevaluationService } from "./../services/darevaluation.service";
import { DaruserService } from "./../services/daruser.service";
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
  dsids = [] as oldNew[];

  constructor(
    private darService: DarService,
    private darcriteriaService: DarcriteriaService,
    private daruserService: DaruserService,
    private darevaluationService: DarevaluationService,
    private darsolutionService: DarsolutionService
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

    // Create solutions
    darJson.darSolutions.forEach(async darSolution => {
      let dsid: oldNew = { old: darSolution.id, new: "" };
      delete darSolution.id;
      await this.darsolutionService
        .createDarsolution(this.did.new, darSolution)
        .then(darsolutionRef => {
          console.log("darsolutionRef", darsolutionRef);
          dsid.new = darsolutionRef.id;
          this.dsids.push(dsid);
        })
        .catch(error =>
          console.error("Error creating Darsolution:", dsid, error)
        );
    });

    // Create darUsers, no changes to the darUser.id
    darJson.darUsers.forEach(async darUser => {
      // update the vote dsid if matches one of the imported solution ids
      if (this.dsids.find(s => s.old == darUser.solutionVote.dsid)) {
        darUser.solutionVote.dsid = this.dsids.find(
          s => s.old == darUser.solutionVote.dsid
        ).new;
      }
      await this.daruserService
        .createDaruser(this.did.new, darUser.id, darUser)
        .then(() => {
          console.log("daruserRef", darUser);
        })
        .catch(error =>
          console.error("Error creating darUser:", darUser, error)
        );
    });

    // Create evaluations
    darJson.darEvaluations.forEach(async darEvaluation => {
      const dsid = this.dsids.find(e => e.old == darEvaluation.dsid).new;
      const dcid = this.dcids.find(e => e.old == darEvaluation.dcid).new;
      darEvaluation["id"] = dcid;
      darEvaluation["did"] = this.did.new;
      darEvaluation["dsid"] = dsid;
      await this.darevaluationService
        .setEvaluation(this.did.new, dsid, dcid, darEvaluation)
        .then(() => {
          console.log("darevaluationRef", darEvaluation);
        })
        .catch(error =>
          console.error("Error creating Darevaluation:", darEvaluation, error)
        );
    });

    //Final cleanup, update dsid if it matches one of the solutions imported
    if (this.dsids.find(s => s.old == darJson.dar.dsid)) {
      this.darService.fieldUpdate(
        this.did.new,
        "dsid",
        this.dsids.find(s => s.old == darJson.dar.dsid).new
      );
    }
  }
}

interface oldNew {
  old: string;
  new: string;
}
