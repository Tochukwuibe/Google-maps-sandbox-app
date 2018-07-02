import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { MapMarkerComponent } from './map-marker/map-marker';
@NgModule({
	declarations: [MapComponent,
    MapMarkerComponent],
	imports: [],
	exports: [MapComponent,
    MapMarkerComponent]
})
export class ComponentsModule {}
