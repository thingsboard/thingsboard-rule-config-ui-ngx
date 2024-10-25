import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import addRuleNodeCoreLocaleEnglish from './locale/rulenode-core-locale.constant';
import { EmptyConfigComponent } from './components/empty-config.component';
import { SharedModule } from '@shared/public-api';
import { RuleNodeCoreConfigActionModule } from './components/action/rulenode-core-config-action.module';
import { RuleNodeCoreConfigFilterModule } from './components/filter/rulenode-core-config-filter.module';
import { RulenodeCoreConfigEnrichmentModule } from './components/enrichment/rulenode-core-config-enrichment.module';
import { RulenodeCoreConfigExternalModule } from './components/external/rulenode-core-config-external.module';
import { RulenodeCoreConfigTransformModule } from './components/transform/rulenode-core-config-transform.module';
import { RuleNodeCoreConfigFlowModule } from './components/flow/rulenode-core-config-flow.module';
import { addLibraryStyles } from './lib-styles';

@NgModule({
  declarations: [
    EmptyConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    RuleNodeCoreConfigActionModule,
    RuleNodeCoreConfigFilterModule,
    RulenodeCoreConfigEnrichmentModule,
    RulenodeCoreConfigExternalModule,
    RulenodeCoreConfigTransformModule,
    RuleNodeCoreConfigFlowModule,
    EmptyConfigComponent
  ]
})
export class RuleNodeCoreConfigModule {

  constructor(translate: TranslateService) {
    addRuleNodeCoreLocaleEnglish(translate);
    addLibraryStyles('tb-rule-node-core-config-css');
  }

}
