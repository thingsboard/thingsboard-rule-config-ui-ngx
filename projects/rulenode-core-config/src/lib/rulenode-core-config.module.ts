import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslateService
} from '@ngx-translate/core';
import { HomeComponentsModule } from '@home/components/public-api';
import { HomePagesModule } from '@home/pages/public-api';
import { SharedModule } from '@shared/public-api';
import addRuleNodeCoreLocaleEnglish from './locale/rulenode-core-locale.constant';
import { EmptyConfigComponent } from './components/empty-config.component';
import { RuleNodeCoreConfigActionModule } from './components/action/rulenode-core-config-action.module';
import { RuleNodeCoreConfigFilterModule } from './components/filter/rulenode-core-config-filter.module';
import { RulenodeCoreConfigEnrichmentModule } from './components/enrichment/rulenode-core-config-enrichment.module';

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
    EmptyConfigComponent
  ]
})
export class RuleNodeCoreConfigModule {

  constructor(translate: TranslateService) {
    addRuleNodeCoreLocaleEnglish(translate);
  }

}
