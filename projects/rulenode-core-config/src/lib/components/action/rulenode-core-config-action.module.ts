import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { AttributesConfigComponent } from './attributes-config.component';
import { TimeseriesConfigComponent } from './timeseries-config.component';
import { RpcRequestConfigComponent } from './rpc-request-config.component';
import { LogConfigComponent } from './log-config.component';
import { AssignCustomerConfigComponent } from './assign-customer-config.component';
import { ClearAlarmConfigComponent } from './clear-alarm-config.component';
import { CreateAlarmConfigComponent } from './create-alarm-config.component';
import { CreateRelationConfigComponent } from './create-relation-config.component';
import { MsgDelayConfigComponent } from './msg-delay-config.component';
import { DeleteRelationConfigComponent } from './delete-relation-config.component';

@NgModule({
  declarations: [
    AttributesConfigComponent,
    TimeseriesConfigComponent,
    RpcRequestConfigComponent,
    LogConfigComponent,
    AssignCustomerConfigComponent,
    ClearAlarmConfigComponent,
    CreateAlarmConfigComponent,
    CreateRelationConfigComponent,
    MsgDelayConfigComponent,
    DeleteRelationConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AttributesConfigComponent,
    TimeseriesConfigComponent,
    RpcRequestConfigComponent,
    LogConfigComponent,
    AssignCustomerConfigComponent,
    ClearAlarmConfigComponent,
    CreateAlarmConfigComponent,
    CreateRelationConfigComponent,
    MsgDelayConfigComponent,
    DeleteRelationConfigComponent
  ]
})
export class RuleNodeCoreConfigActionModule {
}
