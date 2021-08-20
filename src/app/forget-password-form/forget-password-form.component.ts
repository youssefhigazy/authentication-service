import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-forget-password-form',
  templateUrl: './forget-password-form.component.html',
  styleUrls: ['./forget-password-form.component.scss']
})
export class ForgetPasswordFormComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  forget_password_form = new FormGroup({
    email: new FormControl('', Validators.required)
  })

  forgetPassword(): void{
    this.userService.forgetPassword(this.forget_password_form.get("email").value);
  }
}
