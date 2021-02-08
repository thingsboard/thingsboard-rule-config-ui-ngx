import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { CustomerAttributesConfigComponent } from './customer-attributes-config.component';
import { RulenodeCoreConfigCommonModule } from '../common/rulenode-core-config-common.module';
import { EntityDetailsConfigComponent } from './entity-details-config.component';
import { DeviceAttributesConfigComponent } from './device-attributes-config.component';
import { OriginatorAttributesConfigComponent } from './originator-attributes-config.component';
import { OriginatorFieldsConfigComponent } from './originator-fields-config.component';
import { GetTelemetryFromDatabaseConfigComponent } from './get-telemetry-from-database-config.component';
import { RelatedAttributesConfigComponent } from './related-attributes-config.component';
import { TenantAttributesConfigComponent } from './tenant-attributes-config.component';
import { CalculateDeltaConfigComponent } from './calculate-delta-config.component';

@NgModule({
  declarations: [
    CustomerAttributesConfigComponent,
    EntityDetailsConfigComponent,
    DeviceAttributesConfigComponent,
    OriginatorAttributesConfigComponent,
    OriginatorFieldsConfigComponent,
    GetTelemetryFromDatabaseConfigComponent,
    RelatedAttributesConfigComponent,
    TenantAttributesConfigComponent,
    CalculateDeltaConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RulenodeCoreConfigCommonModule
  ],
  exports: [
    CustomerAttributesConfigComponent,
    EntityDetailsConfigComponent,
    DeviceAttributesConfigComponent,
    OriginatorAttributesConfigComponent,
    OriginatorFieldsConfigComponent,
    GetTelemetryFromDatabaseConfigComponent,
    RelatedAttributesConfigComponent,
    TenantAttributesConfigComponent,
    CalculateDeltaConfigComponent
  ]
})
export class RulenodeCoreConfigEnrichmentModule {
}
