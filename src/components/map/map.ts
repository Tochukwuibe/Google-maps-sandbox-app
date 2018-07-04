import { GeoFireProvider } from './../../providers/geo-fire/geo-fire';
import { GoogleMap, GoogleMaps, CameraPosition, LatLng, ILatLng, MarkerOptions, GoogleMapsEvent } from '@ionic-native/google-maps';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MapProvider } from '../../providers/map/map';

import { take, tap, switchMap, map, delay, distinctUntilChanged, debounceTime, throttleTime, bufferCount } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() center: { lat: number, lng: number };
  @Input() CenterIcon: string
  @ViewChild('map') canvas: ElementRef;


  @Output() cameraChange = new EventEmitter<any>()

  public map: GoogleMap;
  private sub: Subscription;
  private mapWidth: number;

  constructor(
    private maps: MapProvider,
    private geo: GeoFireProvider
  ) {

  }

  ngOnInit() {
    this.map = this.maps.initMap(this.canvas.nativeElement)//GoogleMaps.create(this.canvas.nativeElement)
  }


  ngAfterViewInit() {
    const center$ = this.addCenterMarker()
    const event$ = this.monitorCameraMoves();

    this.sub = merge(center$, event$)
      .subscribe()
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
    this.map.setMyLocationButtonEnabled(true)
    this.map.setMyLocationEnabled(true)
    this.mapWidth = this.canvas.nativeElement.scrollWidth;

  }

  private monitorCameraMoves() {

    return this.maps.onMapEvent(GoogleMapsEvent.CAMERA_MOVE)
      .pipe(
        map((data) => data[0]),
        map((data) => {
          return { zoom: this.getRadius(data.zoom), center: data.target }
        }),
        distinctUntilChanged((x, y) => this.changeFn(x, y)),
        throttleTime(500),
        tap(data => console.log(`the camera move data ${JSON.stringify(data)}`)),
        tap((data) => this.cameraChange.emit(data))
      )
  }


  private changeFn(x: { zoom: number; center: any; }, y: { zoom: number; center: any; }) {
    const point1 = [x.center.lat, x.center.lng];
    const point2 = [y.center.lat, y.center.lng];
    const distance = this.geo.getDistanceSync(point1, point2);
    console.log('the change in distance', distance);
    return (distance < Math.floor(x.zoom / 2)) && (x.zoom === y.zoom);
  }

  // private comparisonFn() {
  //   return (x, y) =>{
      
  //     return x.zoom === y.zoom && (x.center.lat === y.center.lat && x.center.lng === y.center.lng) 
  //   };
  // }



  private getRadius(zoom: number) {
  
    const zooms = [21282, 16355, 10064, 5540, 2909, 1485, 752, 378, 190, 95, 48, 24, 12, 6, 3, 1.48, 0.74, 0.37, 0.19];
    let zoomIndex = Math.ceil(zoom) - 1;

    if(zoomIndex > 19) {
      zoomIndex = 19;
    } else if(zoomIndex < 1) {
      zoomIndex = 1;
    }
    return (zooms[zoomIndex] * this.mapWidth) / 1609.34;
  }


  ngOnDestroy() {

    this.sub.unsubscribe()
    this.map.remove()
  }
}
