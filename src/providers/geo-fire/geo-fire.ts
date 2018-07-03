import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as GeoFire from 'geofire'
import { DbProvider } from '../db/db';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebse from 'firebase/app'
import { fromPromise } from 'rxjs/observable/fromPromise';
import { scan, tap, catchError } from 'rxjs/operators';


export enum GeoFireEventKeys {
  entered = 'key_entered',
  exited  = 'key_exited',
  moved   = 'key_moved'
}




@Injectable()
export class GeoFireProvider {

  private ref = firebse.database().ref('locations');
  private geoFire = new GeoFire(this.ref);
  private geoQuery;

  public hits = new BehaviorSubject([]);

  constructor(
    private db: DbProvider
  ) {
    console.log('Hello GeoFireProvider Provider');
  }


  public initQuery(radius: number, coords: Array<number>): Observable<boolean> {
    return new Observable(observer => {
      try {
        this.geoQuery = this.geoFire.query({center: coords, radius: radius})

        // waiting for the ready event and then completing
        this.geoQuery.on('ready', () =>  {
          observer.next(true) 
          observer.complete();
        })
       
      } catch (e) {
        observer.error(e);
      }

      return () => {
        console.log('canceling the init query ')
        // this.geoQuery.cancel();
        // this.geoQuery = null;
        observer.complete();
      }
    })
  }

  public updateCriteria(radius: number, coords: Array<number>) {
    console.log('updating with ', radius, JSON.stringify(coords))
    this.geoQuery.updateCriteria({ center: coords, radius: radius})
  }

  onQuery(keyEvent: string) {
    return new Observable(observer => {
      let qry  = null;

      try {

        if(this.geoQuery) {
          qry = this.geoQuery.on(keyEvent,  (key, loc, dis) => {

            const hit = {
              key: key, 
              location: loc,
              distance: dis
            }
            observer.next(hit)
        })
         

        } else {
          observer.next(null);
          observer.complete();
        }


      } catch (e) {
        if(qry) {
          qry.cancel();
        }
        observer.error(e)
      }

      return () => {
        console.log('canceling the query ')
        if(qry) {
          qry.cancel();
        }
        observer.complete();
      }
        
    })
    .pipe(
    catchError((err) => of([])),
    tap((hit: any) => this.validateDistinct(hit))
  )
  }


  private validateDistinct(hit: any) {
    const currentHits = this.hits.value;
    const currentIds = currentHits.map(hit => hit.key);
    if (currentIds.indexOf(hit.key) < 0) {
      currentHits.push(hit);
      this.hits.next(currentHits);
    }
  }

  setLocation(key: string, coords: Array<number>) {
    return this.geoFire.set(key, coords);
  } 

  getLocationByKey(key: string) {
    return fromPromise(this.geoFire.get(key));
  }

  setWKey(key: string, loc: Array<number>) {
    return fromPromise(this.geoFire.set(key, loc));
  }

  setWMap(map: {[key: string]: Array<number>}) {
    return fromPromise(this.geoFire.set(map));
  }

  remove(key: string) {
    return fromPromise(this.geoFire.remove(key));
  }

  center() {
    return new Observable(observer => {
      try {
          const  center = this.geoQuery.center();
          observer.next(center);
          observer.complete();
      } catch (e) {
          observer.error(e);
      }

      return () => {
        observer.complete();
      }
    })
   
  }

  radius() {
    return new Observable(observer => {
      try {
        const radius = this.geoQuery.radius();
        observer.next(radius);
        observer.complete();
      } catch(e) {
        observer.error(e);
      }

      return () => {
        observer.complete();
      }
    })
  }

  getDistance(point1: Array<number>, point2: Array<number>) {
    return new Observable(observer => {
      try {
        const distance = this.geoFire.distance(point1, point2);
        observer.next(distance);
        observer.complete();

      } catch (e) {
        observer.error(e);
      }

      return () => {
        observer.complete();
      }
    })
  }

  

}
