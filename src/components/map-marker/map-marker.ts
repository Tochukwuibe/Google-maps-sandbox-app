import { GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MapProvider } from '../../providers/map/map';
import { switchMap, tap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

  interface LocationHit {
    location: any [],
    distance: number
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

   this.sub = this.maps.addMarker({lat: lat, lng: lng} || {lat: 37, lng: -85})
    .pipe(switchMap((ref) => this.listenForClick(ref))).subscribe();
  }


  private listenForClick(ref) {
    this.markerRef = ref;
    return this.maps.onMarkerEvent(ref, GoogleMapsEvent.MARKER_CLICK)
    .pipe(tap((e => this.data.next(e))));
  }

  

  ngOnDestroy() {
    this.markerRef.remove()
    this.sub.unsubscribe()
  }


}
