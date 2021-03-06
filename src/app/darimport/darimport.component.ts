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
  importDarResult = { did: "", log: [] } as ImportDarResult;

  constructor(
    private darService: DarService,
    private darcriteriaService: DarcriteriaService,
    private daruserService: DaruserService,
    private darevaluationService: DarevaluationService,
    private darsolutionService: DarsolutionService
  ) {}

  ngOnInit() {}

  onImport() {
    console.log("JSON:", this.txtJSON.nativeElement.value);
    try {
      const darJson = JSON.parse(this.txtJSON.nativeElement.value);

      console.log("darJson:", darJson);

      this.importDar(darJson)
        .then(r => (this.importDarResult = r))
        .catch(error => console.error("Error importing dar:", error));
    } catch (error) {
      this.importDarResult.log.push(" Error reading DAR JSON:" + error);
    }
  }

  async importDar(darJson): Promise<ImportDarResult> {
    let did = {} as oldNew;
    let dcids = [] as oldNew[];
    let dsids = [] as oldNew[];

    let result = { did: "", log: [] } as ImportDarResult;
    // Create the dar
    did.old = darJson.dar.id;
    delete darJson.dar.id;
    darJson.dar.title = darJson.dar.title + " (Copy)";
    await this.darService
      .createDar(darJson.dar)
      .then(darRef => {
        console.log("Added darDocument darRef", darRef);
        did.new = darRef.id;
        result.did = darRef.id;
        result.log.push("Added dar:" + did.new.toString());
      })
      .catch(error => {
        console.error("Error creating Dar:", error);
        result.log.push("Failed creating new DAR document:" + error);
        return result;
      });

    // Create criteria (Note: don't use await inside a forEach)
    for (const darCriteria of darJson.darCriteria) {
      let dcid: oldNew = { old: darCriteria.id, new: "" };
      delete darCriteria.id;
      await this.darcriteriaService
        .createDarcriteria(did.new, darCriteria)
        .then(darcriteriaRef => {
          console.log("darcriteriaRef", darcriteriaRef);
          dcid.new = darcriteriaRef.id;
          dcids.push(dcid);
          result.log.push(
            "Created new DARcriteria document:" + dcid.old + "-" + dcid.new
          );
        })
        .catch(error => {
          console.error("Error creating Darcriteria:", error);
          result.log.push("Failed creating new DARcriteria document:" + error);
          return result;
        });
    }

    // Create solutions
    console.log("Create Solutions start");
    for (const darSolution of darJson.darSolutions) {
      let dsid: oldNew = { old: darSolution.id, new: "" };
      delete darSolution.id;
      await this.darsolutionService
        .createDarsolution(did.new, darSolution)
        .then(darsolutionRef => {
          console.log("darsolutionRef", darsolutionRef);
          dsid.new = darsolutionRef.id;
          dsids.push(dsid);
          result.log.push(
            "Created new Darsolution document:" + dsid.old + "-" + dsid.new
          );
        })
        .catch(error => {
          console.error("Error creating Darsolution:", error);
          result.log.push("Failed creating new DARsolution document:" + error);
          return result;
        });
    }

    // Create darUsers, no changes to the darUser.id
    console.log("Create darusers start");
    for (const darUser of darJson.darUsers) {
      // update the vote dsid if matches one of the imported solution ids
      if (
        dsids &&
        darUser.solutionVote &&
        dsids.find(s => s.old == darUser.solutionVote.dsid)
      ) {
        darUser.solutionVote.dsid = dsids.find(
          s => s.old == darUser.solutionVote.dsid
        ).new;
      }
      await this.daruserService
        .createDaruser(did.new, darUser.id, darUser)
        .then(() => {
          result.log.push("Created new Daruser document:" + darUser.id);
          console.log("daruserRef", darUser);
        })
        .catch(error => {
          console.error("Error creating Daruser:", error);
          result.log.push("Failed creating new DARuser document:" + darUser);
          return result;
        });
    }

    // Create evaluations
    console.log("Create darevaluations start");
    for (const darEvaluation of darJson.darEvaluations) {
      if (dsids && dcids && darEvaluation.dsid && darEvaluation.id) {
        const dsid = dsids.find(e => e.old == darEvaluation.dsid).new;
        const dcid = dcids.find(e => e.old == darEvaluation.id).new;
        darEvaluation["id"] = dcid;
        darEvaluation["did"] = did.new;
        darEvaluation["dsid"] = dsid;
        await this.darevaluationService
          .setEvaluation(did.new, dsid, dcid, darEvaluation)
          .then(() => {
            result.log.push(
              "Created new Darevaluation document, dsid:" +
                dsid +
                " dcid:" +
                dcid
            );
            console.log("darevaluationRef", darEvaluation);
          })
          .catch(error => {
            console.error("Error creating Darevaluation:", error);
            result.log.push(
              "Failed creating new Darevaluation document:" + error
            );
            return result;
          });
      } else {
        result.log.push(
          "Failed creating new Darevaluation document (missing data) dsid:" +
            darEvaluation.dsid +
            " dcid:" +
            darEvaluation.id
        );
      }
    }

    //Final cleanup, update dsid if it matches one of the solutions imported
    console.log("Clean up start");
    if (dsids.find(s => s.old == darJson.dar.dsid)) {
      this.darService.fieldUpdate(
        did.new,
        "dsid",
        dsids.find(s => s.old == darJson.dar.dsid).new
      );
      result.log.push("Cleaned up dar dsid value");
    }

    return result;
  }
}

interface oldNew {
  old: string;
  new: string;
}

interface ImportDarResult {
  did: string;
  log: string[];
}
