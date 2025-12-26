import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonInput, IonButton, IonIcon, IonText, IonButtons 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { personAddOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonInput, IonButton, IonIcon, IonText, IonButtons
  ]
})
export class RegisterPage {
  email = '';
  pass = '';
  confirmPass = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ personAddOutline, mailOutline, lockClosedOutline });
  }

  async creerCompte() {
    if (this.pass !== this.confirmPass) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      await this.auth.register(this.email, this.pass);
      this.router.navigateByUrl('/profile-setup');
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  }
}