import { NgModule } from '@angular/core';
import { SnsConfigComponent } from './sns-config.component';
import { SqsConfigComponent } from './sqs-config.component';
import { PubSubConfigComponent } from './pubsub-config.component';
import { KafkaConfigComponent } from './kafka-config.component';
import { MqttConfigComponent } from './mqtt-config.component';
import { NotificationConfigComponent } from './notification-config.component';
import { RabbitMqConfigComponent } from './rabbit-mq-config.component';
import { RestApiCallConfigComponent } from './rest-api-call-config.component';
import { SendEmailConfigComponent } from './send-email-config.component';
import { AzureIotHubConfigComponent } from './azure-iot-hub-config.component';
import { SendSmsConfigComponent } from './send-sms-config.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { HomeComponentsModule } from '@home/components/public-api';
import { RulenodeCoreConfigCommonModule } from '../common/rulenode-core-config-common.module';
import { SlackConfigComponent } from './slack-config.component';

@NgModule({
  declarations: [
    SnsConfigComponent,
    SqsConfigComponent,
    PubSubConfigComponent,
    KafkaConfigComponent,
    MqttConfigComponent,
    NotificationConfigComponent,
    RabbitMqConfigComponent,
    RestApiCallConfigComponent,
    SendEmailConfigComponent,
    AzureIotHubConfigComponent,
    SendSmsConfigComponent,
    SlackConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule,
    RulenodeCoreConfigCommonModule
  ],
  exports: [
    SnsConfigComponent,
    SqsConfigComponent,
    PubSubConfigComponent,
    KafkaConfigComponent,
    MqttConfigComponent,
    NotificationConfigComponent,
    RabbitMqConfigComponent,
    RestApiCallConfigComponent,
    SendEmailConfigComponent,
    AzureIotHubConfigComponent,
    SendSmsConfigComponent,
    SlackConfigComponent
  ]
})
export class RulenodeCoreConfigExternalModule{
}
