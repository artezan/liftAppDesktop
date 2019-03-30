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
  collectionRefRoutines = firestore.collection('routines');
  collectionRefRoutinesUser = firestore.collection('user');
  constructor() {}
  public saveTicket(ticket: any): Promise<boolean> {
    return new Promise(resolve => {
      console.log(ticket);
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
  public getByIdTicket(id: string): Promise<any> {
    return new Promise(async resolve => {
      const doc = await this.collectionRefRoutines.doc(id).get();
      if (doc.exists) {
        const data = doc.data();
        data[id] = id;
        resolve(<any>data);
      } else {
        resolve(null);
      }
    });
  }
  public editByIdTicket(ticket: any): Promise<boolean> {
    return new Promise(resolve => {
      this.collectionRefRoutines
        .doc(ticket.id)
        .update(ticket)
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
  public getByNumAndUid(number: number, uid: string): Promise<any[]> {
    return new Promise(resolve => {
      this.collectionRefRoutines
        .where('uid', '==', uid)
        .where('number', '==', number)
        .onSnapshot(docs => {
          const data = [];
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