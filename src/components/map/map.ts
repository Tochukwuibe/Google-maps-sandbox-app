import { GoogleMap, GoogleMaps, CameraPosition, LatLng, ILatLng, MarkerOptions } from '@ionic-native/google-maps';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapProvider } from '../../providers/map/map';
import { take, tap, switchMap, map, delay } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Component({
  selector: 'app-map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit, AfterViewInit  {

  @Input() center: {lat: number, lng: number}
  @ViewChild('map') canvas: ElementRef;

  public map: GoogleMap;

  constructor(
    private maps: MapProvider
  ) {
  
  }

  ngOnInit() {
    this.map =  this.maps.initMap(this.canvas.nativeElement)//GoogleMaps.create(this.canvas.nativeElement)
  }


  ngAfterViewInit() {
    // this.addCenterMarker().subscribe();;
  
    this.addCenterMarker().subscribe()
  }




  // sets a marker at the center of the map, at the given coordinates or the users locations
  private addCenterMarker() {
   return of(this.center)
    .pipe(
      switchMap((pos) =>  pos? of(pos) : this.getLocation()),
      delay(1000),
      tap((pos) => this.setCameraOptions(pos)),
      switchMap((pos) => this.maps.addMarker(pos)),  
      take(1)
    )
  }

  private getLocation() {
    return fromPromise(this.map.getMyLocation()).pipe(map((loc) => loc.latLng), map((loc) => {
      return { lat: loc.lat, lng: loc.lng };
    }));
  }

  private setCameraOptions(pos: {lat: number, lng: number}) {
    const cameraOpts: CameraPosition<ILatLng> = {
      target: pos,
      zoom: 15,
      duration: 2000
    }
    this.map.moveCamera(cameraOpts)
  }

}
