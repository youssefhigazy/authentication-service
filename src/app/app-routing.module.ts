import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationPageComponent } from './authentication-page/authentication-page.component';
import { ForgetPasswordFormComponent } from './forget-password-form/forget-password-form.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomePageComponent },
  { path: "auth", component: AuthenticationPageComponent },
  { path: "forget-password", component: ForgetPasswordFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
