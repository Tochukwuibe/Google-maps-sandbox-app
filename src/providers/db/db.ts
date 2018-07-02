import { Injectable } from '@angular/core';
import { 
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  QueryFn
 } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';


// custom types
type ListPredicate<T> = string | AngularFireList<T>;
type ObjectPredicate<T> = string | AngularFireObject<T>;


@Injectable()
export class DbProvider {

  

  constructor(
    private db: AngularFireDatabase
  ) {
    console.log('Hello DbProvider Provider');
  }

  list<T>(ref: ListPredicate<T>, queryFn?: QueryFn) {
    return typeof ref === 'string' ? this.db.list<T>(ref, queryFn) : ref;
  }

  obj<T> (ref: ObjectPredicate<T>) {
    return typeof ref === 'string' ? this.db.object<T>(ref) : ref;
  }


  list$<T>(ref: ListPredicate<T>, queryFn?: QueryFn) {
    return this.list(ref, queryFn).valueChanges()
  }

  obj$<T>(ref: ObjectPredicate<T>) {
    return this.obj(ref).valueChanges();
  }

  listWithIds$<T>(ref: ListPredicate<T>, queryFn?: QueryFn) {
    return this.list(ref, queryFn).snapshotChanges()
    .pipe(
      map((action) => {
          return action.map(a =>  {
            const id = a.payload.key;
            const data = a.payload.val();
            return {id, ...data}
          })
      })
    )
  }

  objWithId$<T> (ref: ObjectPredicate<T>) {
    return this.obj(ref).snapshotChanges()
    .pipe(
      map((action) => {
        const id = action.payload.key;
        const data = action.payload.val();

        return {id, ...data}
      })
    )
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  push<T>(path: ListPredicate<T>, data: any) {
    return this.list(path).push({
        createdAt: this.timestamp,
        updatedAt: this.timestamp,
        ...data
    });
  }

  set<T> (path: ObjectPredicate<T>, data: any) {
      return this.obj(path).set({
        createdAt: this.timestamp,
        updatedAt: this.timestamp,
        ...data
      })
  }

  update<T> (path: ObjectPredicate<T>, data: any) {

    return this.obj(path).update({ 
      updatedAt: this.timestamp,
      ...data
    })

  }

  removeObj<T> (path: ListPredicate<T>, key: string) {
    return this.list(path).remove(key);
  }

  removeList<T> (path: ListPredicate<T>) {
    return this.list(path);
  }




}
