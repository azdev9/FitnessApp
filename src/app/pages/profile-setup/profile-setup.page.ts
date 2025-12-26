import { Component, inject, OnInit } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonInput, IonSelect, IonSelectOption, 
  IonButton, IonButtons, IonIcon, IonLabel, IonBackButton 
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonInput, IonSelect, IonSelectOption, 
    IonButton, IonButtons, IonIcon, IonLabel, IonBackButton
  ],
  templateUrl: './profile-setup.page.html'
})
export class ProfileSetupPage implements OnInit {
  private dataSvc = inject(DataService);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  // Modèle de données complet
  profile = { 
    nom: '', 
    age: 25, 
    poids: 70, 
    taille: 175, 
    sexe: 'H', 
    objectif: 'perdre' 
  };

  constructor() {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    // Charger les données existantes si elles existent pour éviter de tout retaper
    this.dataSvc.getUserProfile().subscribe(p => {
      if (p) {
        this.profile = { ...this.profile, ...p };
      }
    });
  }

  // LA FONCTION QUI REPARE TON ERREUR :
  async valider() {
    try {
      await this.dataSvc.saveFullProfile(this.profile);
      // Une fois enregistré, on va vers le Dashboard
      this.router.navigateByUrl('/tabs/tab1');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde du profil");
    }
  }

  async logout() {
    await this.authSvc.logout();
    this.router.navigateByUrl('/login');
  }
}