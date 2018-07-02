import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public showMap;

  constructor(public navCtrl: NavController) {

  }

  ionViewWillEnter(){
   this.showMap = true;
  }

}
