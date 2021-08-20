import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  loggedIn: boolean;

  constructor(private userService: UserService) {
    this.userService.settingCurrentUserProperDB();
  }

  ngOnInit(): void{
    // Setting up the initial configuration that will take place once the user open the page
    this.userService.initialUserConfigurationOnLoading();
    
    setTimeout(() => {
      this.loggedIn = this.userService.loggedIn;

      if (!this.loggedIn) return;
      // Setting up the current user object to hold the current user's information
      this.currentUser = {};
      // Pulling the current user's information from the database
      // It will be done after 1000 ms from the page loading to ensure the proper respnse
      this.userService.database.doc(this.userService.currentUserEmail).get().subscribe(res => {
        this.currentUser.currentUser = this.userService.currentUser;
        this.currentUser.first_name = res.data().first_name; 
        this.currentUser.last_name = res.data().last_name; 
        this.currentUser.email = this.userService.currentUserEmail;
      });
    }, 1000)

  }

  signOut(){
    this.userService.signOut();
  }
}
