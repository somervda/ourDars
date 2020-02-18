import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AngularFireModule } from "@angular/fire";
import { AngularFirePerformanceModule } from "@angular/fire/performance";

import { environment } from "../environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
// import { AngularFireStorageModule } from "@angular/fire/storage";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule
// MatDialogModule
// MatGridListModule
 } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";

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
import { DarsolutionComponent } from "./darsolution/darsolution.component";
import { DarsolutionsComponent } from "./darsolutions/darsolutions.component";
import { DarevaluationComponent } from "./darevaluation/darevaluation.component";
import { DarcriteriaComponent } from "./darcriteria/darcriteria.component";
import { DarcriteriasComponent } from "./darcriterias/darcriterias.component";
import { DarusersComponent } from "./darusers/darusers.component";
import { DaruserComponent } from "./daruser/daruser.component";
import { MydarsComponent } from "./mydars/mydars.component";
import { DarviewComponent } from "./darview/darview.component";
import { DarvoteComponent } from "./darvote/darvote.component";
import { DarconfirmComponent } from "./darconfirm/darconfirm.component";
import { DarevaluationsComponent } from "./darevaluations/darevaluations.component";
import { SubheadingComponent } from "./subheading/subheading.component";
import { DarevaluationcriteriaComponent } from "./darevaluationcriteria/darevaluationcriteria.component";
import { DarviewevaluationComponent } from "./darviewevaluation/darviewevaluation.component";
import { DarviewevaluationdetailsComponent } from "./darviewevaluationdetails/darviewevaluationdetails.component";
import { NotauthorizedComponent } from "./notauthorized/notauthorized.component";
import { DarexportComponent } from "./darexport/darexport.component";
import { DarimportComponent } from "./darimport/darimport.component";
import { DisableControlDirective } from "./shared/disablecontrol.directive";
import { HelpComponent } from './help/help.component';
import { YoutubeComponent } from './youtube/youtube.component';

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
    DarcriteriasComponent,
    DarusersComponent,
    DaruserComponent,
    MydarsComponent,
    DarviewComponent,
    DarvoteComponent,
    DarconfirmComponent,
    DarevaluationsComponent,
    SubheadingComponent,
    DarevaluationcriteriaComponent,
    DarviewevaluationComponent,
    DarviewevaluationdetailsComponent,
    NotauthorizedComponent,
    DarexportComponent,
    DarimportComponent,
    DisableControlDirective,
    HelpComponent,
    YoutubeComponent
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
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
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
    AngularFirePerformanceModule,
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
