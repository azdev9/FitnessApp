import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, 
  IonCheckbox, IonButtons, IonButton, IonIcon, IonProgressBar, 
  IonSpinner // <--- AJOUTÉ ICI
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
    IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, 
    IonCheckbox, IonButtons, IonButton, IonIcon, IonProgressBar,
    IonSpinner // <--- AJOUTÉ ICI AUSSI
  ],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private dataSvc = inject(DataService);
  private authSvc = inject(AuthService);
  private router = inject(Router);
  
  // Utilisation du type Observable<any> pour éviter l'erreur "unknown"
  profile$: Observable<any> = this.dataSvc.getUserProfile();
  
  today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  constructor() {
    addIcons({ personCircleOutline, logOutOutline });
  }

  // Met à jour la base de données quand on coche une case
  async updateChecklist(profile: any) {
    await this.dataSvc.updateMissions(profile.missions);
  }

  async logout() {
    await this.authSvc.logout();
    this.router.navigateByUrl('/login');
  }
}