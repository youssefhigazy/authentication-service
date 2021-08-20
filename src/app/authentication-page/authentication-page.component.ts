import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication-page.component.html',
  styleUrls: ['./authentication-page.component.scss']
})
export class AuthenticationPageComponent implements OnInit {
  form_type: string;
  signup_form_container: HTMLElement;
  login_form_container: HTMLElement;
  users: Observable<any>;
  currentUserEmail: any;
  currentUser: any;
  collections: AngularFirestoreCollection<any>;
  database: AngularFirestoreCollection<any>;
  userDatabase: AngularFirestoreDocument<any>;
  error: any;

  constructor(private authService: AngularFireAuth, private firestore: AngularFirestore, private userService: UserService) {
    this.users = this.firestore.collection("users_info").valueChanges();
    this.database = this.firestore.collection("users_info");
    this.authService.onAuthStateChanged((user) => this.currentUser = user);
  }
  
  ngOnInit(): void {
    this.signup_form_container = document.querySelector(".signup-container");
    this.login_form_container = document.querySelector(".login-container");

    // Setting the default form typr to be sign up
    this.form_type = "signup";
    this.signup_form_container.classList.add("selected-form");

    this.authService.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.currentUserEmail = user.email;
      console.log(this.currentUser.email);
      this.getUserFirstName();
    });


    // Testing that the database is properly connected and show real data
    //
    // this.users.subscribe(res => {
    //   console.log(res);
    // })
  }

  loginForm = new FormGroup({
    'email': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
  })

  signupForm = new FormGroup({
    'first_name': new FormControl('', Validators.required),
    'last_name': new FormControl('', Validators.required),
    'email': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
  })

  signupFormSelected(): void {
    this.form_type = "signup";
    this.styleSelectedForm();
  }
  
  loginFormSelected(): void {
    this.form_type = "login";
    this.styleSelectedForm();
  }
  
  styleSelectedForm(): void{
    if (this.form_type === "signup") {
      this.signup_form_container.classList.add("selected-form");
      this.login_form_container.classList.remove("selected-form");
    }
    if (this.form_type === "login") {
      this.login_form_container.classList.add("selected-form");
      this.signup_form_container.classList.remove("selected-form");
    }
  }

  async signup(): Promise<void>{
    this.userService.signup(this.signupForm.get("first_name").value,
                            this.signupForm.get("last_name").value,
                            this.signupForm.get("email").value,
                            this.signupForm.get("password").value,
                            this.currentUser);
  }

  async login(): Promise<void>{
    this.userService.login(this.loginForm.get("email").value,
                           this.loginForm.get("password").value,
                           this.currentUser)
  }

  injectUserIntoDatabase(first_name=this.signupForm.get("first_name").value, last_name=this.signupForm.get("last_name").value): void{
    this.userService.injectUserIntoDatabase(first_name, last_name);
  }

  signupWithGoogleAccount(): void{
    this.userService.signupWithGoogleAccount(this.currentUser);
  }

  getUserFirstName(){
    this.database.doc(this.currentUserEmail).get().subscribe(res => {
      console.log(res.data().first_name);
    })
  }
}
