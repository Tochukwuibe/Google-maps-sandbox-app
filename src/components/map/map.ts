import { GoogleMap, GoogleMaps, CameraPosition, LatLng, ILatLng, MarkerOptions, GoogleMapsEvent } from '@ionic-native/google-maps';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MapProvider } from '../../providers/map/map';

import { take, tap, switchMap, map, delay, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'app-map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit, AfterViewInit {

  @Input() center: { lat: number, lng: number };
  @Input() CenterIcon: string
  @ViewChild('map') canvas: ElementRef;


  @Output() cameraChange = new EventEmitter<any>()

  public map: GoogleMap;

  constructor(
    private maps: MapProvider
  ) {

  }

  ngOnInit() {
    this.map = this.maps.initMap(this.canvas.nativeElement)//GoogleMaps.create(this.canvas.nativeElement)
  }


  ngAfterViewInit() {
    const center$ = this.addCenterMarker()
    const event$ =  this.monitorCameraMoves();
    
    merge(center$, event$).subscribe()
  }


  // sets a marker at the center of the map, at the given coordinates or the users locations
  private addCenterMarker() {
    return of(this.center)
      .pipe(
        switchMap((pos) => pos ? of(pos) : this.getLocation()),
        delay(1000),
        tap((pos) => this.setCameraOptions(pos)),
        switchMap((pos) => this.maps.addMarker(pos, this.CenterIcon)),
        take(1)
      )
  }

  private getLocation() {
    return fromPromise(this.map.getMyLocation()).pipe(map((loc) => loc.latLng), map((loc) => {
      return { lat: loc.lat, lng: loc.lng };
    }));
  }

  private setCameraOptions(pos: { lat: number, lng: number }) {
    const cameraOpts: CameraPosition<ILatLng> = {
      target: pos,
      zoom: 10,
      duration: 2000
    }
    this.map.moveCamera(cameraOpts)
  }

  private monitorCameraMoves() {

    return this.maps.onMapEvent(GoogleMapsEvent.CAMERA_MOVE)
      .pipe(
        map((data) => data[0]),
        map((data) => {
          return {zoom: data.zoom, center: data.target}
        }),
        distinctUntilChanged(this.comparisonFn()),
        debounceTime(500),
        tap(data => console.log(`the camera move data ${JSON.stringify(data)}`)),
        tap((data) => this.cameraChange.emit(data) )
      )
  }


  private comparisonFn() {
    return (x, y) => x.zoom === y.zoom && (x.center.lat === y.center.lat && x.center.lng === y.center.lng);
  }
}
