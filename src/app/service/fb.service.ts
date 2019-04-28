import { IRoutine } from 'src/app/models/routine.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { FB_CONFIG, FB_KEY_SERVER } from '../_conf/fb-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

firebase.initializeApp(FB_CONFIG);
// Inica firestore
const firestore = firebase.firestore();
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `key=${FB_KEY_SERVER}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class FbService {
  private collectionRefRoutines = firestore.collection('routines');
  private collectionRefRoutinesUser = firestore.collection('user');
  private URL_FIREBASE = `https://fcm.googleapis.com/fcm/send`;

  constructor(private http: HttpClient) {}
  // msg por http api
  public sendNotification(uid: string): Observable<any> {
    const DATA = {
      notification: {
        title: 'Nueva Rutina 💪',
        body: 'Se ha subido una nueva rutina'
      },
      priority: 'high',
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },

      to: `/topics/topic-${uid}`
    };
    return this.http.post(this.URL_FIREBASE, DATA, httpOptions);
  }
  //  firestore
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
