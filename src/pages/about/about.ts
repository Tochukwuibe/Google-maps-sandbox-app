import { switchMap, filter, tap } from 'rxjs/operators';
import { GeoFireProvider } from './../../providers/geo-fire/geo-fire';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {




  public coords: Observable<{ lat: number, lng: number }[]>;

  private onCoords = new Subject();
  private sub: Subscription;


  constructor(
    public navCtrl: NavController,
    private geo: GeoFireProvider,
  ) {

  }

  ionViewWillEnter() {
    this.coords = this.geo.hits.asObservable();

    this.sub = this.onCoords.pipe(
      filter(res => !!res),
      switchMap((data: { zoom: number, center: { lat: number, lng: number } }) => this.geo.initQuery(Math.round(data.zoom), [data.center.lat, data.center.lng])),
      switchMap(() => this.geo.onQuery('key_entered')),
      // tap((data) => console.log(`the query result ${JSON.stringify(data)}`))
    ).subscribe();
  }



  onCameraChange(event: { zoom: number, center: { lat: number, lng: number } }) {
    this.onCoords.next(event);
  } 


  onMarkerClick(event) {
    alert(`the click event ${JSON.stringify(event)}`)
  }



  ionViewWillLeave(){
    this.sub.unsubscribe()
  }
}
