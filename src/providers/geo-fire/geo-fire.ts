import { Injectable } from '@angular/core';
import * as GeoFire from 'geofire'
import { DbProvider } from '../db/db';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebse from 'firebase/app'


@Injectable()
export class GeoFireProvider {

  private ref = firebse.database().ref('locations')
  private geoFire = new GeoFire(this.ref);

  public hits = new BehaviorSubject([])

  constructor(
    private db: DbProvider
  ) {
    console.log('Hello GeoFireProvider Provider');
  }



  setLocation(key: string, coords: Array<number>) {
    return this.geoFire.set(key, coords)
  } 

  getLocations(radius: number, coords: Array<number>) {
    return this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_entered', (key, location, distance) => {
      let hit = {
        location: location,
        distance: distance
      }

      let currentHits = this.hits.value
      currentHits.push(hit)
      this.hits.next(currentHits)
    })
  }


  

}
