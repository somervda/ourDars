import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-darimport',
  templateUrl: './darimport.component.html',
  styleUrls: ['./darimport.component.scss']
})
export class DarimportComponent implements OnInit {
  @ViewChild("txtJSON", { static: true }) txtJSON;

  constructor() { }

  ngOnInit() {
  }

  onImport() {
    console.log("JSON:",this.txtJSON.nativeElement.value);
    const json = JSON.parse(this.txtJSON.nativeElement.value);
    console.log("json:",json);

  }

}
