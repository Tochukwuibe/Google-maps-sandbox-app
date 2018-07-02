import { GeoFireProvider } from './../../providers/geo-fire/geo-fire';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(
    public navCtrl: NavController,
    private geo: GeoFireProvider) {

  }
  private seedDatabase() {
    let dummyPoints = [
      [37.9, -122.1],
      [38.7, -122.2],
      [38.1, -122.3],
      [38.3, -122.0],
      [38.7, -122.1]
    ]
  
    dummyPoints.forEach((val, idx) => {
      let name = `dummy-location-${idx}`
      console.log(idx)
      this.geo.setLocation(name, val)
    })
  }

}
