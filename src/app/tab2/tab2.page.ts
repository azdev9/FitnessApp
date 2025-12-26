import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, 
  IonBadge, IonSpinner, IonCard, IonCardContent 
} from '@ionic/angular/standalone'; 
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, 
    IonBadge, IonSpinner, IonCard, IonCardContent
  ]
})
export class Tab2Page {
  private dataSvc = inject(DataService);
  private authSvc = inject(AuthService);
  private router = inject(Router);
  
  profile$: Observable<any> = this.dataSvc.getUserProfile();

  constructor() {
    addIcons({ personCircleOutline, logOutOutline, chevronForwardOutline });
  }

  async logout() {
    await this.authSvc.logout();
    this.router.navigateByUrl('/login');
  }
}