import { Component, OnInit, OnDestroy, OnChanges, Input } from "@angular/core";
import { Crud } from "../models/global.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Daruser } from "../models/daruser.model";
import { Subscription, Observable } from "rxjs";
import { DaruserService } from "../services/daruser.service";
import { MatSnackBar } from "@angular/material";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-daruser",
  templateUrl: "./daruser.component.html",
  styleUrls: ["./daruser.component.scss"]
})
export class DaruserComponent implements OnInit, OnDestroy, OnChanges {
  // Note: Treat @Input as read only, I ran into problems with change detection
  // when I updated the values in the component.
  @Input() did: string;
  @Input() duid: string;
  @Input() crudAction: Crud;
  // Update dummy value with new value each time component is
  // updated from parent component to force OnChange to fire.
  @Input() dummyValue: number;
  _did: string;
  _duid: string;
  _crudAction: Crud;
  Crud = Crud;
  form: FormGroup;
  daruser: Daruser;
  daruser$: Subscription;

  selectedUser: string;
  selectEmail: string;
  // users subscription and results
  users$: Subscription;
  users: User[];
  // darusers subscription and results
  darusers$: Subscription;
  darusers: Daruser[];
  // Array of users that can be user to select a new user on a create
  // is the list of users minus users already assigned to the dar
  createUserOptions: UserOption[];

  constructor(
    private fb: FormBuilder,
    private daruserService: DaruserService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit() {
    // console.log("daruser onInit");
    this.resetLocalValues();
  }

  ngOnChanges() {
    this.resetLocalValues();
    this.createForm();
    this.darusers = [];
    this.users = [];
    if (this._crudAction == Crud.Create) {
      this.users$ = this.userService.findAllUsers(25).subscribe(users => {
        this.users = users;
        this.rebuildCreateUserOptions();
      });
      this.darusers$ = this.daruserService
        .findAllDarusers(this._did, 100)
        .subscribe(darusers => {
          this.darusers = darusers;
          this.rebuildCreateUserOptions();
        });
    }

    if (this._crudAction == Crud.Update || this._crudAction == Crud.Delete) {
      if (this.daruser$) this.daruser$.unsubscribe();

      this.daruser$ = this.daruserService
        .findById(this._did, this._duid)
        .subscribe(du => {
          this.daruser = du;
          this.form.patchValue(this.daruser);
          console.log("ngOnChanges daruser", this.daruser);
        });
    }
    if (this.form) this.form.patchValue(this.daruser);
    if (this._crudAction == Crud.Update) {
      // Check for validation errors all the time
      for (const field in this.form.controls) {
        this.form.get(field).markAsTouched();
      }
    }
  }

  onFieldUpdate(fieldName: string) {
    if (
      this.form.get(fieldName).valid &&
      this.daruser.id != "" &&
      this._crudAction == this.Crud.Update
    ) {
      let newValue = this.form.get(fieldName).value;
      this.daruserService.fieldUpdate(
        this._did,
        this._duid,
        fieldName,
        newValue
      );
    }
  }

  onCreate() {
    for (const field in this.form.controls) {
      this.daruser[field] = this.form.get(field).value;
    }
    // get user's email and displayName from the createUserOptions array
    const newDarUserOption = this.createUserOptions.find(
      userOption => userOption.uid == this.selectedUser
    );
    console.log("onCreate", newDarUserOption);
    this.daruser.email = newDarUserOption.email;
    this.daruser.displayName = newDarUserOption.displayName;

    this.daruserService
      .createDaruser(this._did, this.selectedUser, this.daruser)
      .then(docRef => {
        this.snackBar.open(
          "User '" + newDarUserOption.email + "' created.",
          "",
          {
            duration: 2000
          }
        );
        // Reset detail form
        this._duid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error creating user: ", error);
      });
  }

  onDelete() {
    const email = this.daruser.email;
    this.daruserService
      .deleteDaruser(this._did, this._duid)
      .then(() => {
        this.snackBar.open("User '" + email + "' deleted!", "", {
          duration: 2000
        });
        // Reset detail form
        this._duid = undefined;
        this._crudAction = undefined;
      })
      .catch(function(error) {
        console.error("Error deleting user: ", error);
      });
  }

  resetLocalValues() {
    this._did = this.did;
    this._duid = this.duid;
    this._crudAction = this.crudAction;
    this.daruser = {
      email: ""
    };
  }

  rebuildCreateUserOptions() {
    // Reset array
    this.createUserOptions = [];
    this.users.forEach(user => {
      // Check the user is not already a daruser
      if (!this.darusers.some(u => u.id === user.uid)) {
        // Add the user as a createUserOption
        this.createUserOptions.push({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      }
    });
    console.log("rebuildCreateUserOptions", this.createUserOptions);
  }

  createForm() {
    // Create form group and initialize with  values
    this.form = this.fb.group({
      email: [
        this.daruser.email,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40)
        ]
      ],
      isOwner: [this.daruser.isOwner],
      isStakeholder: [this.daruser.isStakeholder],
      isEvaluator: [this.daruser.isEvaluator],
      isReader: [this.daruser.isReader],
      isVoter: [this.daruser.isVoter]
    });
  }

  ngOnDestroy() {
    // Clean up any subscriptions
    if (this.daruser$) this.daruser$.unsubscribe();
    if (this.users$) this.users$.unsubscribe();
    if (this.darusers$) this.darusers$.unsubscribe();
  }
}

interface UserOption {
  uid: string;
  email: string;
  displayName: string;
}
