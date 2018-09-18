
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';


@Injectable()
export class GeoFireXProvider {

  private geo = geofirex.init(firebase);

  constructor() {
    console.log('Hello GeoFireXProvider Provider');
  }


  public setPoint(colref: string, coord: Array<number>, name: string) {
    const cities = this.geo.collection(colref);
    const point = this.geo.point(coord[0], coord[1]);

    return cities.add({name: name, position: point.data})
  }


  public getLocations( colref: string, center: Array<number>, radius: number ) {
     console.log('the query ', colref, center, radius)
    const cities = this.geo.collection(colref)
    console.log('the center', center[0], center[1])
    const Center = this.geo.point(center[0], center[1])


    console.log('the center ', Center)

    return cities.within(Center, radius, 'position')
  }

}
