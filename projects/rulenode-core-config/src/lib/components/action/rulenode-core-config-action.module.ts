import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { HomeComponentsModule } from '@home/components/public-api';
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
import { GeneratorConfigComponent } from './generator-config.component';
import { GpsGeoActionConfigComponent } from './gps-geo-action-config.component';
import { MsgCountConfigComponent } from './msg-count-config.component';
import { RpcReplyConfigComponent } from './rpc-reply-config.component';
import { SaveToCustomTableConfigComponent } from './save-to-custom-table-config.component';
import { RulenodeCoreConfigCommonModule } from '../common/rulenode-core-config-common.module';
import { UnassignCustomerConfigComponent } from './unassign-customer-config.component';
import { SnsConfigComponent } from './sns-config.component';
import { SqsConfigComponent } from './sqs-config.component';
import { PubSubConfigComponent } from './pubsub-config.component';
import { KafkaConfigComponent } from './kafka-config.component';
import { MqttConfigComponent } from './mqtt-config.component';
import { RabbitMqConfigComponent } from './rabbit-mq-config.component';
import { RestApiCallConfigComponent } from './rest-api-call-config.component';
import { SendEmailConfigComponent } from './send-email-config.component';
import { CheckPointConfigComponent } from './check-point-config.component';
import { AzureIotHubConfigComponent } from './azure-iot-hub-config.component';
import { DeviceProfileConfigComponent } from './device-profile-config.component';
import { SendSmsConfigComponent } from './send-sms-config.component';
import { PushToEdgeConfigComponent } from './push-to-edge-config.component';
import { PushToCloudConfigComponent } from './push-to-cloud-config.component';

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
    DeleteRelationConfigComponent,
    GeneratorConfigComponent,
    GpsGeoActionConfigComponent,
    MsgCountConfigComponent,
    RpcReplyConfigComponent,
    SaveToCustomTableConfigComponent,
    UnassignCustomerConfigComponent,
    SnsConfigComponent,
    SqsConfigComponent,
    PubSubConfigComponent,
    KafkaConfigComponent,
    MqttConfigComponent,
    RabbitMqConfigComponent,
    RestApiCallConfigComponent,
    SendEmailConfigComponent,
    CheckPointConfigComponent,
    AzureIotHubConfigComponent,
    DeviceProfileConfigComponent,
    SendSmsConfigComponent,
    PushToEdgeConfigComponent,
    PushToCloudConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule,
    RulenodeCoreConfigCommonModule
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
    DeleteRelationConfigComponent,
    GeneratorConfigComponent,
    GpsGeoActionConfigComponent,
    MsgCountConfigComponent,
    RpcReplyConfigComponent,
    SaveToCustomTableConfigComponent,
    UnassignCustomerConfigComponent,
    SnsConfigComponent,
    SqsConfigComponent,
    PubSubConfigComponent,
    KafkaConfigComponent,
    MqttConfigComponent,
    RabbitMqConfigComponent,
    RestApiCallConfigComponent,
    SendEmailConfigComponent,
    CheckPointConfigComponent,
    AzureIotHubConfigComponent,
    DeviceProfileConfigComponent,
    SendSmsConfigComponent,
    PushToEdgeConfigComponent,
    PushToCloudConfigComponent
  ]
})
export class RuleNodeCoreConfigActionModule {
}
