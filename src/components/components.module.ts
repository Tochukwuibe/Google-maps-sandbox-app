import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { MapMarkerComponent } from './map-marker/map-marker';
import { IonicModule } from 'ionic-angular';
import { AppVideoComponent } from './app-video/app-video';
import { AddyMapComponent } from './addy-map/addy-map';
@NgModule({
	declarations: [MapComponent,
    MapMarkerComponent,
    AppVideoComponent,
    AddyMapComponent],
	imports: [
		IonicModule
	],
	exports: [MapComponent,
    MapMarkerComponent,
    AppVideoComponent,
    AddyMapComponent]
})
export class ComponentsModule {}
