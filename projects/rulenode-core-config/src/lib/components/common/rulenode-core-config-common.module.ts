import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { HomeComponentsModule } from '@home/components/public-api';
import { KvMapConfigComponent } from './kv-map-config.component';
import { DeviceRelationsQueryConfigComponent } from './device-relations-query-config.component';
import { RelationsQueryConfigComponent } from './relations-query-config.component';

@NgModule({
  declarations: [
    KvMapConfigComponent,
    DeviceRelationsQueryConfigComponent,
    RelationsQueryConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule
  ],
  exports: [
    KvMapConfigComponent,
    DeviceRelationsQueryConfigComponent,
    RelationsQueryConfigComponent
  ]
})
export class RulenodeCoreConfigCommonModule {
}
