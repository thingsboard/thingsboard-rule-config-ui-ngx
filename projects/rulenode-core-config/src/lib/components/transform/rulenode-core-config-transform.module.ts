import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { ChangeOriginatorConfigComponent } from './change-originator-config.component';
import { RulenodeCoreConfigCommonModule } from '../common/rulenode-core-config-common.module';
import { TransformScriptConfigComponent } from './script-config.component';
import { ToEmailConfigComponent } from './to-email-config.component';
import { RenameKeysConfigComponent } from './rename-keys-config.component';

@NgModule({
  declarations: [
    ChangeOriginatorConfigComponent,
    TransformScriptConfigComponent,
    ToEmailConfigComponent,
    RenameKeysConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RulenodeCoreConfigCommonModule
  ],
  exports: [
    ChangeOriginatorConfigComponent,
    TransformScriptConfigComponent,
    ToEmailConfigComponent,
    RenameKeysConfigComponent
  ]
})
export class RulenodeCoreConfigTransformModule {
}
