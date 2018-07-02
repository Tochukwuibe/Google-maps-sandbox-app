import { GoogleMapsEvent } from '@ionic-native/google-maps';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MapProvider } from '../../providers/map/map';
import { switchMap, tap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-marker',
  templateUrl: 'map-marker.html'
})
export class MapMarkerComponent implements OnInit, OnDestroy {

  @Input() position: {lat: number, lng: number};
  @Input() animation: string;
  @Input() icon: string;
  @Input() title: string;
  @Input() event: string;


  @Output() data = new EventEmitter<any>();


  private sub: Subscription;

  constructor(
    private maps: MapProvider
  ) {
    console.log('Hello MapMarkerComponent Component');
    
  }

  ngOnInit() {
   this.sub = this.maps.addMarker(this.position || {lat: 37, lng: -85})
    .pipe(
      switchMap((ref) => this.listenForEvent(ref))
    ).subscribe();
  }


  private listenForEvent(ref) {
    return this.maps.onMarkerEvent(ref, GoogleMapsEvent.MARKER_CLICK)
    .pipe(
      tap((e => this.data.next(e))),
      tap((e) => alert(`the event  ${JSON.stringify(e)}`) ),
      take(1)
    );
  }

  

  ngOnDestroy() {
    console.log('ng on destroy')
    this.sub.unsubscribe()
  }


}
