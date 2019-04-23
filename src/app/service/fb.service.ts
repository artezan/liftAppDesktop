import { IRoutine } from 'src/app/models/routine.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { FB_CONFIG } from '../_conf/fb-config';

firebase.initializeApp(FB_CONFIG);
// Inica firestore
const firestore = firebase.firestore();
// configuracion de firestore requerida
// const settings = { timestampsInSnapshots: true };
// firestore.settings(settings);
@Injectable({
  providedIn: 'root'
})
export class FbService {
  private collectionRefRoutines = firestore.collection('routines');
  private collectionRefRoutinesUser = firestore.collection('user');
  constructor() {}
  public saveDoc(ticket: any): Promise<boolean> {
    return new Promise(resolve => {
      this.collectionRefRoutines
        .add(ticket)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
  public deleteByIdTicket(id: string): Promise<boolean> {
    return new Promise(resolve => {
      this.collectionRefRoutines
        .doc(id)
        .delete()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
  public getRoutineByIdUser(id: string): Promise<any> {
    return new Promise(async resolve => {
      const doc = await this.collectionRefRoutines.doc(id).get();
      if (doc.exists) {
        const data = doc.data();
        data[id] = id;
        resolve(data as any);
      } else {
        resolve(null);
      }
    });
  }
  public editDoc(routine: IRoutine): Promise<boolean> {
    return new Promise(resolve => {
      this.collectionRefRoutines
        .doc(routine.id)
        .update(routine)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
  public getAll(): Promise<any[]> {
    return new Promise(resolve => {
      this.collectionRefRoutines.onSnapshot(docs => {
        const data = [];
        docs.forEach(doc => {
          data.push(Object.assign(doc.data(), { id: doc.id }));
        });
        resolve(data);
      });
    });
  }
  public getByUid(uid: string): Promise<IRoutine[]> {
    return new Promise(resolve => {
      this.collectionRefRoutines.where('uid', '==', uid).onSnapshot(docs => {
        const data: IRoutine[] = [];
        docs.forEach(doc => {
          data.push(Object.assign(doc.data(), { id: doc.id }));
        });
        resolve(data);
      });
    });
  }
  public getAllUser(): Promise<any[]> {
    return new Promise(resolve => {
      this.collectionRefRoutinesUser.onSnapshot(docs => {
        const data = [];
        docs.forEach(doc => {
          data.push(Object.assign(doc.data(), { id: doc.id }));
        });
        resolve(data);
      });
    });
  }
}
