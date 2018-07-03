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
      [39.169906308047295, -85.95544245433807],
      [39.163906308047295, -85.95344245433807],
      [39.179906308047295, -85.95344245433807],
      [39.269906308047295, -85.9344245433807],
      [39.19906308047295, -85.95344245433807],
    ]
  
    dummyPoints.forEach((val, idx) => {
      let name = `dummy-locations-${idx}`
      console.log(idx)
      this.geo.setLocation(name, val)
    })
  }

}
