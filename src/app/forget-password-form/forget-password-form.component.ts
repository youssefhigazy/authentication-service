import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forget-password-form',
  templateUrl: './forget-password-form.component.html',
  styleUrls: ['./forget-password-form.component.scss']
})
export class ForgetPasswordFormComponent implements OnInit {
  users: Observable<any>;
  database: AngularFirestoreCollection<any>;
  currentUser: any;
  currentUserEmail: any;

  constructor(private authService: AngularFireAuth, private firestore: AngularFirestore) {
    this.users = this.firestore.collection("users_info").valueChanges();
    this.database = this.firestore.collection("users_info");
    this.authService.onAuthStateChanged((user) => this.currentUser = user);
  }

  ngOnInit(): void {
  }

  forget_password_form = new FormGroup({
    email: new FormControl('', Validators.required)
  })

  forgetPassword(): void{
    this.authService.sendPasswordResetEmail(this.forget_password_form.get("email").value)
    .then(() => {
      console.log("An email was sent to the given email address.");
    })
    .catch((error) => {
      console.log(error);
    })
  }
}
