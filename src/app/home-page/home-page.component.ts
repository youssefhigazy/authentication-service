import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/app';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  stockAddBtn: HTMLElement;
  userDB: AngularFirestoreDocument<any>;
  currentUser: firebase.User;

  constructor(private authService: AngularFireAuth, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.settingCurrentUSerProperDB();
    this.stockAddBtn = document.querySelector(".add-stock-btn");
  }

  settingCurrentUSerProperDB(): void{
    this.authService.onAuthStateChanged((user) => {
      this.currentUser = user;
      console.log(this.currentUser.email);
      this.userDB = this.firestore.collection("users_info").doc(this.currentUser.email);
      this.userDB.get().subscribe(res => {
        console.log(res.data());
      });
    });
  }

  stockForm = new FormGroup({
    "stock_symbol": new FormControl("", Validators.required)
  })

  addStock(): void{
    this.userDB.get().subscribe(res =>{
      if (res.data().stocks.includes(this.stockForm.get("stock_symbol").value)) return;
    })
    
    this.userDB.update({
      stocks: firebase.firestore.FieldValue.arrayUnion(this.stockForm.get("stock_symbol").value)
    })
  }
}
