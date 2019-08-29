import { take, map, tap, switchMap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, of as observableOf } from "rxjs";
import { User } from "../models/user.model";
import { DarService } from '../services/dar.service';

@Injectable({
  providedIn: "root"
})
export class IsStakeholderGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router,private  darService: DarService) {}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = next.params.id
    console.log ("IsStakeholderGuard id:",id);

    this.auth.user$.pipe(
        switchMap(
          u =>
            (return this.darService.findById(id).pipe(map (x=> true)))
        )
      );
    return  observableOf(true);
  }
}
