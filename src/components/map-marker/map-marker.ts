import { GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MapProvider } from '../../providers/map/map';
import { switchMap, tap, take, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';


  interface LocationHit {
    location: any [],
    distance: number,
    key: string
  }

@Component({
  selector: 'app-marker',
  templateUrl: 'map-marker.html'
})
export class MapMarkerComponent implements OnInit, OnDestroy {

  @Input() position: LocationHit;
  @Input() animation: string;
  @Input() icon: string;
  @Input() title: string;
  @Input() event: string;


  @Output() data = new EventEmitter<any>();


  private sub: Subscription;
  private markerRef: Marker;

  constructor(
    private maps: MapProvider
  ) {
    console.log('Hello MapMarkerComponent Component');
    
  }

  ngOnInit() {

    const lat = this.position.location[0];
    const lng = this.position.location[1];

   this.sub = this.maps.addMarker({lat: lat, lng: lng})
    .pipe(
      tap((marker) => this.markerRef = marker),
      delay(300),
      switchMap(() => this.listenForClick())
    ).subscribe();
  }


  private listenForClick() {
    return this.maps.onMarkerEvent(this.markerRef, GoogleMapsEvent.MARKER_CLICK)
    .pipe(tap((e => this.data.next(this.position))));
  }

  

  ngOnDestroy() {
    if(this.markerRef) {
      console.log('removing the marker')
      this.markerRef.remove()
    }
    
    this.sub.unsubscribe()
  }


}
