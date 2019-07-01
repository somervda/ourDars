import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DarService } from '../services/dar.service';
import { DarsDataSource } from '../services/dars.datasource';
import { MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';
import { DarStatus } from '../models/dar.model';

@Component({
  selector: 'app-admin-dars',
  templateUrl: './admin-dars.component.html',
  styleUrls: ['./admin-dars.component.scss']
})
export class AdminDarsComponent implements OnInit, AfterViewInit {

  dataSource: DarsDataSource;
  displayedColumns = ["title","darStatus","description","id"];
  darStatus = DarStatus;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private darService: DarService) { }

  ngOnInit() {
    this.dataSource = new DarsDataSource(this.darService);

    this.dataSource.loadDars("", "title", "asc", 100);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange
      .pipe(
        tap(() => {
          console.log("sort", this.sort);
          this.loadDarsPage();
        })
      )
      .subscribe();
  }

  loadDarsPage() {
    this.dataSource.loadDars(
      "",
      this.sort.active,
      this.sort.direction == "" ? "asc" : this.sort.direction,
      100
    );
  }

}
