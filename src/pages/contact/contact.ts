import { FirestoreProvider } from './../../providers/firestore/firestore';
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
    private geo: GeoFireProvider,
    private afs: FirestoreProvider) {

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

  public addPoints() {
    let dummyPoints = [
      [38.16990647295, -85.95544245807],
      [35.1639063080295, -86.9245433807],
      [39.179906308047295, -87.95344245433807],
      [39.269906308047295, -87.9344245433807],
      [39.99906305, -88.9535433807],
      [38.169906308047295, -85.95544245433807],
      [34.106308047295, -87.9534433807],
      [38.179906308047295, -87.99945433807],
      [39.9969908047295, -90.9344245433807],
      [40.99906305, -88.433807],
    ]

    dummyPoints.forEach(async (val) => {
        await  this.afs.add('locations', {coords: val})
    })
  }

}
