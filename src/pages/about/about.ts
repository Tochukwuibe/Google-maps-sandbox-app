import { switchMap, filter, tap } from 'rxjs/operators';
import { GeoFireProvider } from './../../providers/geo-fire/geo-fire';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public showMap;

  private onCoords = new Subject()

  public coords: Observable< {lat: number, lng: number}[]>;

  private initial = true;
  

  constructor(
    public navCtrl: NavController,
    private geo: GeoFireProvider,
    ) {

  }

  ionViewWillEnter(){
   this.showMap = true;

   this.coords = this.onCoords.pipe(
     filter(res => !!res),
     switchMap((data: {zoom: number, center: {lat: number, lng: number}}) =>  this.geo.initQuery(20, [data.center.lat, data.center.lng]) ),
     switchMap(() => this.geo.onQuery('key_entered')),
     tap((data) => console.log(`the query result ${JSON.stringify(data)}`) )
  )
   
  }



  ionViewDidEnter(){
   
  }

  onCameraChange(event: {zoom: number, center: {lat: number, lng: number}}) {
   
      // const newEvent = {
      //   ...event,
      //   zoom: Math.ceil(200 / event.zoom)
      // }

      this.onCoords.next(event);
      this.initial = false;

 
    
  }

}
