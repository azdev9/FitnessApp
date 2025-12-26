import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: 'tab3.page.html'
})
export class Tab3Page implements AfterViewInit {
  @ViewChild('chartCanvas') canvas!: ElementRef;
  private dataSvc = inject(DataService);
  private authSvc = inject(AuthService);
  private router = inject(Router);
  chart: any;

  constructor() { addIcons({ personCircleOutline, logOutOutline }); }

  ngAfterViewInit() {
    this.dataSvc.getWeightHistory().subscribe(data => {
      if(data && data.length > 0) setTimeout(() => this.updateChart(data), 500);
    });
  }

  updateChart(history: any[]) {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: history.map(h => h.date),
        datasets: [{ label: 'Poids (kg)', data: history.map(h => h.poids), borderColor: '#3880ff', tension: 0.3 }]
      }
    });
  }

  async logout() { await this.authSvc.logout(); this.router.navigateByUrl('/login'); }
}