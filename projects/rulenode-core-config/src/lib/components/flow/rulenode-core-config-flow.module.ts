import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/public-api';
import { RulenodeCoreConfigCommonModule } from '../common/rulenode-core-config-common.module';
import { RuleChainInputComponent } from './rule-chain-input.component';
import { RuleChainOutputComponent } from './rule-chain-output.component';

@NgModule({
  declarations: [
    RuleChainInputComponent,
    RuleChainOutputComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RulenodeCoreConfigCommonModule
  ],
  exports: [
    RuleChainInputComponent,
    RuleChainOutputComponent
  ]
})
export class RuleNodeCoreConfigFlowModule {
}
