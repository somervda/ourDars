import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AngularFireModule } from "@angular/fire";

import { environment } from "../environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
// import { AngularFireStorageModule } from "@angular/fire/storage";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  MatListModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  //MatDividerModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule
  // MatDialogModule,
  // MatGridListModule
} from "@angular/material";

import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import "hammerjs";

import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { AboutComponent } from "./about/about.component";
import { LoginComponent } from "./login/login.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { AdministrationComponent } from "./administration/administration.component";
import { UsersComponent } from "./users/users.component";
import { UserComponent } from "./user/user.component";
import { TeamsComponent } from "./teams/teams.component";
import { TeamComponent } from "./team/team.component";
import { AdminDarsComponent } from "./admin-dars/admin-dars.component";
import { DarComponent } from "./dar/dar.component";
import { DarfolderComponent } from "./darfolder/darfolder.component";
import { DarsolutionComponent } from './darsolution/darsolution.component';
import { DarsolutionsComponent } from './darsolutions/darsolutions.component';
import { DarevaluationComponent } from './darevaluation/darevaluation.component';
import { DarcriteriaComponent } from './darcriteria/darcriteria.component';
import { DarcriteriasComponent } from './darcriterias/darcriterias.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotfoundComponent,
    AboutComponent,
    LoginComponent,
    AdministrationComponent,
    UsersComponent,
    UserComponent,
    TeamsComponent,
    TeamComponent,
    AdminDarsComponent,
    DarComponent,
    DarfolderComponent,
    DarsolutionComponent,
    DarsolutionsComponent,
    DarevaluationComponent,
    DarcriteriaComponent,
    DarcriteriasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule,
    //MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    // MatMenuModule,
    //MatDividerModule,
    MatTabsModule,
    // MatTableModule,
    // MatDialogModule,
    MatDatepickerModule,
    // MatMomentDateModule,
    AppRoutingModule,
    NgbCarouselModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    // Allow offline operations - useful when used in combination with PWA functionality
    // AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
