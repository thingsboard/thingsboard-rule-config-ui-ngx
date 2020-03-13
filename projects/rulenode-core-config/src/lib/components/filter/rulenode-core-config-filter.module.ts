import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { CheckMessageConfigComponent } from './check-message-config.component';
import { CheckRelationConfigComponent } from './check-relation-config.component';
import { GpsGeoFilterConfigComponent } from './gps-geo-filter-config.component';
import { MessageTypeConfigComponent } from './message-type-config.component';
import { OriginatorTypeConfigComponent } from './originator-type-config.component';
import { ScriptConfigComponent } from './script-config.component';
import { SwitchConfigComponent } from './switch-config.component';
import { CheckAlarmStatusComponent } from './check-alarm-status.component';
import { RulenodeCoreConfigCommonModule } from '../common/rulenode-core-config-common.module';

@NgModule({
  declarations: [
    CheckMessageConfigComponent,
    CheckRelationConfigComponent,
    GpsGeoFilterConfigComponent,
    MessageTypeConfigComponent,
    OriginatorTypeConfigComponent,
    ScriptConfigComponent,
    SwitchConfigComponent,
    CheckAlarmStatusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RulenodeCoreConfigCommonModule
  ],
  exports: [
    CheckMessageConfigComponent,
    CheckRelationConfigComponent,
    GpsGeoFilterConfigComponent,
    MessageTypeConfigComponent,
    OriginatorTypeConfigComponent,
    ScriptConfigComponent,
    SwitchConfigComponent,
    CheckAlarmStatusComponent
  ]
})
export class RuleNodeCoreConfigFilterModule {
}
