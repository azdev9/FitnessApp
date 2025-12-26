import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonInput, IonButton, IonIcon, IonButtons 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { logInOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonInput, IonButton, IonIcon, IonButtons
  ]
})
export class LoginPage {
  email = '';
  pass = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ logInOutline, mailOutline, lockClosedOutline });
  }

  async onLogin() {
    try {
      await this.auth.login(this.email, this.pass);
      this.router.navigateByUrl('/tabs/tab1');
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  }
}