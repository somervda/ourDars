import { take, map, tap, switchMap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, of as observableOf } from "rxjs";
import { User } from "../models/user.model";
import { DarService } from "../services/dar.service";

@Injectable({
  providedIn: "root"
})
export class IsDarRoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private darService: DarService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!route.params.id)
      return observableOf(false);
    const id = route.params.id;
    if (!route.data.role)
      return observableOf(false);
    const role = route.data.role;
    // adminOverride is an optional parameter to  force
    // the guard to return true independent of the users Dar Role
    // if they are an administrator
    const adminOverride = route.data.adminOverride;
    // console.log("IsStakeholderGuard id:", id, " role:", role);

    let hasRole$: Observable<boolean> = this.darService.findById(id).pipe(
      map(d => {
        let result = false;
        switch (role) {
          case "stakeholder":
            result = d.darUserIndexes.isStakeholder.includes(
              this.auth.currentUser.uid
            );
            break;
          case "owner":
            result = d.darUserIndexes.isOwner.includes(
              this.auth.currentUser.uid
            );
            break;
          case "voter":
            result = d.darUserIndexes.isVoter.includes(
              this.auth.currentUser.uid
            );
            break;
          case "evaluator":
            result = d.darUserIndexes.isEvaluator.includes(
              this.auth.currentUser.uid
            );
            break;
          case "reader":
            result = d.darUserIndexes.isDarUser.includes(
              this.auth.currentUser.uid
            );
            break;
          default:
            result = false;
            break;
        }
        return <boolean>result;
      })
    );

    return this.auth.user$.pipe(
      take(1),
      tap((u: User) => {
        // If the user does not have required access then redirect
        // console.log("u tap:", u);
        if (!u) this.router.navigateByUrl("login");
        if (!u.isDarCreator)
          this.router.navigateByUrl("notAuthorized?path='" + state.url + "'");
      }),
      // Return true if we make it past the tap
      switchMap(u => {
        if (u.isAdmin && adminOverride) return observableOf(true);
        return hasRole$;
      })
    );
  }
}
