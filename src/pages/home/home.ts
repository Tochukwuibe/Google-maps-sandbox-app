import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public map: GoogleMap; 

  constructor(
    public navCtrl: NavController,
    private maps: GoogleMaps) {
  }

  ionViewWillEnter(){
  //  this.initMap()
  }



  async initMap() {
    this.map = GoogleMaps.create('map_canvas')
    this.map.setMyLocationButtonEnabled(true);
    this.map.setMyLocationEnabled(true)

    const location = await  this.map.getMyLocation();

   const marker = await  this.map.addMarkerSync({
      title: 'dummy location',
      icon: 'assets/icon/favicon.ico',
      animation: 'drop',
      position: {
        lat: location.latLng.lat,
        lng: location.latLng.lng
      }
    })
  
 

    marker.showInfoWindow();
    marker.addEventListener(GoogleMapsEvent.MARKER_CLICK)
    .pipe(
      tap((data) => console.log(' a marker was clicked', JSON.stringify(data)))
    ).subscribe()
  }

}
