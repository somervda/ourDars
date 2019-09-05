import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { AboutComponent } from "./about/about.component";
import { LoginComponent } from "./login/login.component";
import { UsersComponent } from "./users/users.component";
import { UserComponent } from "./user/user.component";
import { UserResolver } from "./services/user-resolver";
import { AdministrationComponent } from "./administration/administration.component";
import { IsAdminGuard } from "./guards/isAdmin.guard";
import { IsActivatedGuard } from "./guards/isActivated.guard";
import { TeamsComponent } from "./teams/teams.component";
import { TeamComponent } from "./team/team.component";
import { AdminDarsComponent } from "./admin-dars/admin-dars.component";
import { TeamResolver } from "./services/team-resolver";
import { DarComponent } from "./dar/dar.component";
import { DarResolver } from "./services/dar-resolver";
import { DarfolderComponent } from "./darfolder/darfolder.component";
import { DarevaluationsComponent } from "./darevaluations/darevaluations.component";
import { IsDarCreatorGuard } from "./guards/isDarCreator.guard";
import { MydarsComponent } from "./mydars/mydars.component";
import { DarviewComponent } from "./darview/darview.component";
import { DarvoteComponent } from "./darvote/darvote.component";
import { DarconfirmComponent } from "./darconfirm/darconfirm.component";
import { DarauditComponent } from "./daraudit/daraudit.component";
import { NotauthorizedComponent } from "./notauthorized/notauthorized.component";
import { IsDarRoleGuard } from "./guards/isDarRole.guard";
import { DarexportComponent } from './darexport/darexport.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
  { path: "notAuthorized", component: NotauthorizedComponent },
  {
    path: "mydars",
    component: MydarsComponent,
    canActivate: [IsActivatedGuard]
  },
  {
    path: "administration",
    component: AdministrationComponent,
    canActivate: [IsAdminGuard]
  },
  { path: "users", component: UsersComponent, canActivate: [IsAdminGuard] },
  {
    path: "user/:uid",
    component: UserComponent,
    resolve: { user: UserResolver },
    canActivate: [IsActivatedGuard],
    runGuardsAndResolvers: "always"
  },

  {
    path: "team/create",
    component: TeamComponent,
    canActivate: [IsAdminGuard]
  },
  {
    path: "team/:id",
    component: TeamComponent,
    resolve: { team: TeamResolver },
    canActivate: [IsAdminGuard]
  },
  {
    path: "team/delete/:id",
    component: TeamComponent,
    resolve: { team: TeamResolver },
    canActivate: [IsAdminGuard]
  },
  { path: "teams", component: TeamsComponent, canActivate: [IsAdminGuard] },
  {
    path: "darview/:id",
    component: DarviewComponent,
    resolve: { dar: DarResolver },
    canActivate: [IsDarRoleGuard],
    data: { role: "reader", adminOverride: true }
  },
  {
    path: "darvote/:id",
    component: DarvoteComponent,
    canActivate: [IsDarRoleGuard],
    data: { role: "voter" },
    resolve: { dar: DarResolver }
  },
  {
    path: "darconfirm/:id",
    component: DarconfirmComponent,
    canActivate: [IsDarRoleGuard],
    data: { role: "stakeholder" },
    resolve: { dar: DarResolver }
  },
  {
    path: "daraudit/:id",
    component: DarauditComponent,
    resolve: { dar: DarResolver }
  },
  {
    path: "darfolder/create",
    component: DarfolderComponent,
    canActivate: [IsDarCreatorGuard]
  },
  {
    path: "darfolder/:id",
    component: DarfolderComponent,
    resolve: { dar: DarResolver },
    canActivate: [IsDarRoleGuard],
    data: { role: "owner", adminOverride: true }
  },
  {
    path: "darfolder/delete/:id",
    component: DarfolderComponent,
    resolve: { dar: DarResolver },
    canActivate: [IsAdminGuard]
  },
  {
    path: "darexport/:id",
    component: DarexportComponent,
    resolve: { dar: DarResolver },
    canActivate: [IsAdminGuard]
  },
  {
    path: "darevaluations/:id",
    component: DarevaluationsComponent,
    resolve: { dar: DarResolver },
    canActivate: [IsDarRoleGuard],
    data: { role: "evaluator" }
  },

  {
    path: "adminDars",
    component: AdminDarsComponent,
    canActivate: [IsAdminGuard]
  },
  { path: "notfound", component: NotfoundComponent },
  { path: "**", component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
