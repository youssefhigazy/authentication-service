import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

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

  constructor(private authService: AngularFireAuth, private firestore: AngularFirestore) {
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
    await this.authService.createUserWithEmailAndPassword(this.signupForm.get("email").value, this.signupForm.get("password").value)
    .then((userCredential) => {
      let currentUser = userCredential.user;
      this.currentUser = currentUser;
      this.currentUserEmail = userCredential.user.email;
      window.location.replace("/");
    })
    .catch((error) => {
      this.error = error.message;
    })

    await this.injectUserIntoDatabase();
  }

  async login(): Promise<void>{
    await this.authService.setPersistence("local")
    .then(() => {
      this.authService.signInWithEmailAndPassword(this.loginForm.get("email").value, this.loginForm.get("password").value)
      .then((userCredential) => {
        this.currentUser = userCredential.user;
        console.log(`${this.currentUser.email} was logged in successfully!`); 
        window.location.replace("/");
      })
      .catch((error) => {
        this.error = error.message;
      })
    })
  }

  injectUserIntoDatabase(first_name=this.signupForm.get("first_name").value, last_name=this.signupForm.get("last_name").value): void{
    this.userDatabase = this.database.doc(this.currentUserEmail);

    this.userDatabase.set({
      username: this.currentUserEmail,
      first_name: first_name,
      last_name: last_name,
      stocks: [] // Specially added for the stocks application, could be removed for other purposes.
    }).catch((error) => {
      return error;
    });
    
    console.log("The user was registered in the Database successfully!");
  }

  signupWithGoogleAccount(): void{
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      let credential = result.credential;
      let user = result.user;
      this.currentUser = user;
      this.currentUserEmail = user.email;
      window.location.replace("/");
    }).catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;
      this.error = errorMessage;
      console.log(error);
    })

    let currentUSerNameArray = (this.currentUser.displayName as String).split(" ");
    this.injectUserIntoDatabase(currentUSerNameArray[0], currentUSerNameArray[1]);
  }

  forgetPassowrd(){
    this.authService.sendPasswordResetEmail("")
  }

  getUserFirstName(){
    this.database.doc(this.currentUserEmail).get().subscribe(res => {
      console.log(res.data().first_name);
    })
  }
}
