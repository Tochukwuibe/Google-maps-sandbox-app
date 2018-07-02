import { Injectable } from '@angular/core';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, GoogleMapOptions } from '@ionic-native/google-maps';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, switchMap } from 'rxjs/operators';


@Injectable()
export class MapProvider {


  private mapRef: GoogleMap;
  private ready = new BehaviorSubject<boolean>(false)

  constructor(private map: GoogleMaps) {
    console.log('Hello MapProvider Provider');
  }


  public initMap(id: any, opts?: GoogleMapOptions) {
    try {
      const map = GoogleMaps.create(id, opts);
      this.mapRef = map;

      this.ready.next(true);

      return map
    } catch (e) {
      alert(`the err ${JSON.stringify(e)}`)

      return null;
    }

  }


  public addMarker(
    postion: { lat: number, lng: number },
    icon?: string,
    title?: string,
    animation?: string
  ) {

    return this.ready.pipe(
      filter(res => !!res),
      switchMap(() =>   fromPromise(this.mapRef.addMarker({
        position: postion,
        title: title || 'Marker',
        icon: icon || 'assets/icon/favicon.ico',
        animation: animation || 'DROP'
      })))
    )
    
  
  }


  public onMarkerEvent(ref: Marker, event: string): Observable<any> {
   
    const markerEvent$ = new Observable (observer => {

    const sub = ref.addEventListener(event)
        .subscribe((e) => {
          observer.next(e)
        })

      return () => {
        observer.complete()
        sub.unsubscribe()
        return ref.off(event);
      }
    })

    return markerEvent$;
  }

}
