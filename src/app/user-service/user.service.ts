import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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


  async signup(first_name: string, last_name: string, email: string, password: string): Promise<void>{
    await this.authService.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let currentUser = userCredential.user;
      this.currentUser = currentUser;
      this.currentUserEmail = userCredential.user.email;
      window.location.replace("/");
    })
    .catch((error) => {
      this.error = error.message;
    })

    await this.injectUserIntoDatabase(first_name, last_name);
  }

  async login(email: string, password: string): Promise<void>{
    await this.authService.setPersistence("local")
    .then(() => {
      this.authService.signInWithEmailAndPassword(email, password)
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

  injectUserIntoDatabase(first_name, last_name): void{
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

  forgetPassword(email: string): void{
    this.authService.sendPasswordResetEmail(email)
    .then(() => {
      console.log("An email was sent to the given email address.");
    })
    .catch((error) => {
      console.log(error);
    })
  }

  settingCurrentUSerProperDB(): void{
    this.authService.onAuthStateChanged((user) => {
      this.currentUser = user;
      console.log(this.currentUser.email);
      this.userDatabase = this.firestore.collection("users_info").doc(this.currentUser.email);
      this.userDatabase.get().subscribe(res => {
        console.log(res.data());
      });
    });
  }

  signOut(){
    this.authService.signOut().then(() => {
      console.log("Signed Out!");
      window.location.reload();
    }).catch((error) => {
      console.log(error);
    })
  }
}
