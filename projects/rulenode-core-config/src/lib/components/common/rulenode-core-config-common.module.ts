import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { HomeComponentsModule } from '@home/components/public-api';
import { KvMapConfigComponent } from './kv-map-config.component';
import { DeviceRelationsQueryConfigComponent } from './device-relations-query-config.component';
import { RelationsQueryConfigComponent } from './relations-query-config.component';
import { MessageTypesConfigComponent } from './message-types-config.component';
import { CredentialsConfigComponent } from './credentials-config.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ArgumentsMapConfigComponent } from './arguments-map-config.component';
import { MathFunctionAutocompleteComponent } from './math-function-autocomplete.component';
import { OutputMessageTypeAutocompleteComponent } from './output-message-type-autocomplete.component';
import { KvMapConfigOldComponent } from './kv-map-config-old.component';
import { MsgMetadataChipComponent } from './msg-metadata-chip.component';
import { SlideToggleComponent } from './slide-toggle.component';

@NgModule({
  declarations: [
    KvMapConfigComponent,
    DeviceRelationsQueryConfigComponent,
    RelationsQueryConfigComponent,
    MessageTypesConfigComponent,
    CredentialsConfigComponent,
    SafeHtmlPipe,
    ArgumentsMapConfigComponent,
    MathFunctionAutocompleteComponent,
    OutputMessageTypeAutocompleteComponent,
    KvMapConfigOldComponent,
    MsgMetadataChipComponent,
    SlideToggleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeComponentsModule
  ],
  exports: [
    KvMapConfigComponent,
    DeviceRelationsQueryConfigComponent,
    RelationsQueryConfigComponent,
    MessageTypesConfigComponent,
    CredentialsConfigComponent,
    SafeHtmlPipe,
    ArgumentsMapConfigComponent,
    MathFunctionAutocompleteComponent,
    OutputMessageTypeAutocompleteComponent,
    KvMapConfigOldComponent,
    MsgMetadataChipComponent,
    SlideToggleComponent
  ]
})

export class RulenodeCoreConfigCommonModule {
}
