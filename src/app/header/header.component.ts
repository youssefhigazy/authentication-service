import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  users: Observable<any>;
  database: AngularFirestoreCollection<any>;
  currentUser: any;
  currentUserEmail: any;
  loggedIn: boolean;

  constructor(private authService: AngularFireAuth, private firestore: AngularFirestore) {
    this.users = this.firestore.collection("users_info").valueChanges();
    this.database = this.firestore.collection("users_info");
    this.authService.onAuthStateChanged((user) => this.currentUser = user);
  }

  ngOnInit(): void {
    this.loggedIn = false;
    this.authService.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.currentUserEmail = user.email;
      console.log(this.currentUser.email);
      this.loggedIn = true;
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
