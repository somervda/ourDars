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
  log = "";

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
    try {
      const darJson = JSON.parse(this.txtJSON.nativeElement.value);

      console.log("darJson:", darJson);

      await this.importDar(darJson)
        .then(s => (this.log = s))
        .catch(error => console.error("Error importing dar:", error));
    } catch (error) {
      this.log += " Error reading DAR JSON:" + error;
    }
  }

  async importDar(darJson): Promise<string> {
    let did = {} as oldNew;
    let dcids = [] as oldNew[];
    let dsids = [] as oldNew[];

    let log = "";
    // Create the dar
    did.old = darJson.dar.id;
    delete darJson.dar.id;
    await this.darService
      .createDar(darJson.dar)
      .then(darRef => {
        console.log("darRef", darRef);
        did.new = darRef.id;
        log += " Added dar:" + did.new.toString();
      })
      .catch(error => {
        console.error("Error creating Dar:", error);
        log += " Failed creating new DAR document:" + error;
        return log;
      });

    // Create criteria
    await darJson.darCriteria.forEach(async darCriteria => {
      let dcid: oldNew = { old: darCriteria.id, new: "" };
      delete darCriteria.id;
      await this.darcriteriaService
        .createDarcriteria(did.new, darCriteria)
        .then(darcriteriaRef => {
          console.log("darcriteriaRef", darcriteriaRef);
          dcid.new = darcriteriaRef.id;
          dcids.push(dcid);
          log +=
            " Created new DARcriteria document:" + dcid.old + "-" + dcid.new;
        })
        .catch(error => {
          console.error("Error creating Darcriteria:", error);
          log += " Failed creating new DARcriteria document:" + error;
          return log;
        });
    });

    // Create solutions
    await darJson.darSolutions.forEach(async darSolution => {
      let dsid: oldNew = { old: darSolution.id, new: "" };
      delete darSolution.id;
      await this.darsolutionService
        .createDarsolution(did.new, darSolution)
        .then(darsolutionRef => {
          console.log("darsolutionRef", darsolutionRef);
          dsid.new = darsolutionRef.id;
          dsids.push(dsid);
          log +=
            " Created new Darsolution document:" + dsid.old + "-" + dsid.new;
        })
        .catch(error => {
          console.error("Error creating Darsolution:", error);
          log += " Failed creating new DARsolution document:" + error;
          return log;
        });
    });

    // Create darUsers, no changes to the darUser.id
    await darJson.darUsers.forEach(async darUser => {
      // update the vote dsid if matches one of the imported solution ids
      if (dsids.find(s => s.old == darUser.solutionVote.dsid)) {
        darUser.solutionVote.dsid = dsids.find(
          s => s.old == darUser.solutionVote.dsid
        ).new;
      }
      await this.daruserService
        .createDaruser(did.new, darUser.id, darUser)
        .then(() => {
          log += " Created new Daruser document:" + darUser.id;
          console.log("daruserRef", darUser);
        })
        .catch(error => {
          console.error("Error creating Daruser:", error);
          log += " Failed creating new DARuser document:" + error;
          return log;
        });
    });

    // Create evaluations
    await darJson.darEvaluations.forEach(async darEvaluation => {
      const dsid = dsids.find(e => e.old == darEvaluation.dsid).new;
      const dcid = dcids.find(e => e.old == darEvaluation.dcid).new;
      darEvaluation["id"] = dcid;
      darEvaluation["did"] = did.new;
      darEvaluation["dsid"] = dsid;
      await this.darevaluationService
        .setEvaluation(did.new, dsid, dcid, darEvaluation)
        .then(() => {
          log +=
            " Created new Darevaluation document, dsid:" +
            dsid +
            " dcid:" +
            dcid;
          console.log("darevaluationRef", darEvaluation);
        })
        .catch(error => {
          console.error("Error creating Darevaluation:", error);
          log += " Failed creating new Darevaluation document:" + error;
          return log;
        });
    });

    //Final cleanup, update dsid if it matches one of the solutions imported
    if (dsids.find(s => s.old == darJson.dar.dsid)) {
      this.darService.fieldUpdate(
        did.new,
        "dsid",
        dsids.find(s => s.old == darJson.dar.dsid).new
      );
      log += " Cleaned up dar.dsid.";
    }

    console.log("end of dar import", log);
    return log;
  }
}

interface oldNew {
  old: string;
  new: string;
}
