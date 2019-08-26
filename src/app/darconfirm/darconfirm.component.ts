import { Component, OnInit, ViewChild } from '@angular/core';
import { Dar } from '../models/dar.model';
import { ActivatedRoute } from '@angular/router';
import { DaruserService } from '../services/daruser.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Daruser } from '../models/daruser.model';

@Component({
  selector: 'app-darconfirm',
  templateUrl: './darconfirm.component.html',
  styleUrls: ['./darconfirm.component.scss']
})
export class DarconfirmComponent implements OnInit {
  @ViewChild("confirmDar", { static: true }) confirmDar;
  @ViewChild("confirmComment", { static: true }) confirmComment;
  dar: Dar;
  daruser$: Observable<Daruser>;


  constructor(
    private route: ActivatedRoute,
    private daruserService: DaruserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.dar = this.route.snapshot.data["dar"];
    console.log("DarconfirmComponent", this.dar);

    this.daruser$ = this.daruserService
    .findById(this.dar.id, this.auth.currentUser.uid)
  }

  onConfirmatedUpdate() {
    console.log("DarconfirmComponent onConfirmatedUpdate",this.confirmDar.checked)
    this.daruserService.fieldUpdate(
      this.dar.id,
      this.auth.currentUser.uid,
      "confirmed",
      this.confirmDar.checked
    );

  }

  onConfirmCommentUpdate() {
    console.log("DarconfirmComponent onConfirmCommentUpdate",this.confirmComment.nativeElement.value)
    this.daruserService.fieldUpdate(
      this.dar.id,
      this.auth.currentUser.uid,
      "confirmComment",
      this.confirmComment.nativeElement.value
    );
  }

}
