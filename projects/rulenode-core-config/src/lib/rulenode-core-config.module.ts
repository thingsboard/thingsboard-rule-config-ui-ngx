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

@NgModule({
  declarations: [
    EmptyConfigComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    RuleNodeCoreConfigActionModule,
    EmptyConfigComponent
  ]
})
export class RuleNodeCoreConfigModule {

  constructor(translate: TranslateService) {
    addRuleNodeCoreLocaleEnglish(translate);
  }

}
