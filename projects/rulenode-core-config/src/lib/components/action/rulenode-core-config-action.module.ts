import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { AttributesConfigComponent } from './attributes-config.component';
import { TimeseriesConfigComponent } from './timeseries-config.component';

@NgModule({
  declarations: [
    AttributesConfigComponent,
    TimeseriesConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AttributesConfigComponent,
    TimeseriesConfigComponent
  ]
})
export class RuleNodeCoreConfigActionModule {
}
