import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, docData, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async saveFullProfile(data: any) {
    const user = this.auth.currentUser;
    if (!user) return;

    // Calcul des calories
    let bmr = (10 * data.poids) + (6.25 * data.taille) - (5 * data.age);
    bmr = (data.sexe === 'H') ? bmr + 5 : bmr - 161;
    let calories = Math.round(bmr * 1.5); 
    if (data.objectif === 'perdre') calories -= 500; else calories += 400;

    const isLoss = data.objectif === 'perdre';

    // Génération des listes de repas selon l'objectif
    const repasListe = isLoss ? [
      { repas: 'Petit-Déjeuner', menu: 'Omelette (2 œufs) + Thé vert', cal: 300 },
      { repas: 'Déjeuner', menu: 'Poulet grillé + Brocolis + 50g Riz', cal: 500 },
      { repas: 'Dîner', menu: 'Poisson blanc + Salade verte', cal: 400 }
    ] : [
      { repas: 'Petit-Déjeuner', menu: 'Bol d\'avoine + Beurre cacahuète', cal: 600 },
      { repas: 'Déjeuner', menu: 'Pâtes complètes + Steak haché 5%', cal: 800 },
      { repas: 'Dîner', menu: 'Riz + Poulet + Avocat', cal: 700 }
    ];

    // Génération des listes d'exercices selon l'objectif
    const exercicesListe = isLoss ? [
      { ex: 'Burpees', type: 'Cardio', desc: '4 séries de 15' },
      { ex: 'Squats Jumps', type: 'HIIT', desc: '4 séries de 20' },
      { ex: 'Planche', type: 'Gainage', desc: '3 x 1 minute' }
    ] : [
      { ex: 'Développé Couché', type: 'Force', desc: '4 séries de 10' },
      { ex: 'Presse Jambes', type: 'Volume', desc: '4 séries de 12' },
      { ex: 'Tractions', type: 'Dos', desc: '3 séries au max' }
    ];

    const profileData = {
      ...data,
      objectifCalories: calories,
      repasListe: repasListe,
      exercicesListe: exercicesListe,
      regimeTitre: isLoss ? "Régime Hypocalorique" : "Prise de Masse",
      regimeDetail: isLoss ? "Déficit calorique. Protéines élevées." : "Surplus calorique. Glucides complexes.",
      trainingTitre: isLoss ? "HIIT Brûle-Graisse" : "Force & Volume",
      trainingDetail: isLoss ? "30min Cardio + HIIT (20 reps)." : "Musculation (8-12 reps).",
      missions: [
        { id: 1, titre: 'Boire 2.5L d\'eau', fait: false },
        { id: 2, titre: 'Séance de sport', fait: false },
        { id: 3, titre: '10 000 pas', fait: false },
        { id: 4, titre: 'Sommeil 8h', fait: false }
      ],
      setupComplete: true
    };

    await setDoc(doc(this.firestore, `users/${user.uid}`), profileData, { merge: true });
    
    // Historique du poids
    const today = new Date().toISOString().split('T')[0];
    await setDoc(doc(this.firestore, `users/${user.uid}/poids_history/${today}`), { poids: data.poids, date: today }, { merge: true });
  }

  getUserProfile(): Observable<any> {
    return authState(this.auth).pipe(
      switchMap(user => user ? docData(doc(this.firestore, `users/${user.uid}`)) : of(null))
    );
  }

  async updateMissions(missions: any) {
    const user = this.auth.currentUser;
    if (user) await setDoc(doc(this.firestore, `users/${user.uid}`), { missions }, { merge: true });
  }

  getWeightHistory(): Observable<any[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        const q = query(collection(this.firestore, `users/${user.uid}/poids_history`), orderBy('date', 'asc'));
        return collectionData(q);
      })
    );
  }
}