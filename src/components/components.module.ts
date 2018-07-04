import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { MapMarkerComponent } from './map-marker/map-marker';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [MapComponent,
    MapMarkerComponent],
	imports: [
		IonicModule
	],
	exports: [MapComponent,
    MapMarkerComponent]
})
export class ComponentsModule {}
