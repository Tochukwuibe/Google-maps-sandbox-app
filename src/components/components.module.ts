import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { MapMarkerComponent } from './map-marker/map-marker';
import { IonicModule } from 'ionic-angular';
import { AppVideoComponent } from './app-video/app-video';
@NgModule({
	declarations: [MapComponent,
    MapMarkerComponent,
    AppVideoComponent],
	imports: [
		IonicModule
	],
	exports: [MapComponent,
    MapMarkerComponent,
    AppVideoComponent]
})
export class ComponentsModule {}
