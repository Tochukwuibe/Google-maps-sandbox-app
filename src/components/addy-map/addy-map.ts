import { Subject } from 'rxjs/Subject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapProvider } from '../../providers/map/map';
import { filter, distinctUntilChanged, debounceTime, switchMap, tap, take } from 'rxjs/operators';

@Component({
  selector: 'addy-map',
  templateUrl: 'addy-map.html'
})
export class AddyMapComponent implements OnInit, OnDestroy {


  private val = new Subject<string>()
  public address = '';
  
  constructor(private maps: MapProvider) {
    console.log('Hello AddyMapComponent Component');
  }


  ngOnInit() {
   
  }




  public searchAddress() {
    this.maps.searchAddress(this.address)
    .pipe(
      tap((addy) => console.log('the address ', JSON.stringify (addy) )),
      tap((pos) => this.maps.setCameraOptions(pos)),
      switchMap((pos) => this.addMarker(pos)),
      take(1)
    ).subscribe()

  }



  private addMarker(center: any) {
    this.maps.clearMap();
   return this.maps.addMarker(center)
  }


  

  ngOnDestroy() {
    
  }

}
