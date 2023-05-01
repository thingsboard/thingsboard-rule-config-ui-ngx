import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull, isObject, isUndefinedOrNull } from '@core/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { TranslateService } from '@ngx-translate/core';
import { FetchTo } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-originator-attributes-config',
  templateUrl: './originator-attributes-config.component.html',
  styleUrls: ['./originator-attributes-config.component.scss']
})
export class OriginatorAttributesConfigComponent extends RuleNodeConfigurationComponent {

  originatorAttributesConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.originatorAttributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.originatorAttributesConfigForm = this.fb.group({
      tellFailureIfAbsent: [isDefinedAndNotNull(configuration?.tellFailureIfAbsent) ? configuration.tellFailureIfAbsent : false, []],
      fetchTo: [isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA, []],
      attributesControl: [configuration ? configuration.attributesControl : null, []]
    });
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (isObject(configuration)) {
      configuration.attributesControl = {
        clientAttributeNames:  isDefinedAndNotNull(configuration?.clientAttributeNames) ? configuration.clientAttributeNames : null,
        latestTsKeyNames: isDefinedAndNotNull(configuration?.latestTsKeyNames) ? configuration.latestTsKeyNames : null,
        serverAttributeNames: isDefinedAndNotNull(configuration?.serverAttributeNames) ? configuration.serverAttributeNames : null,
        sharedAttributeNames: isDefinedAndNotNull(configuration?.sharedAttributeNames) ? configuration.sharedAttributeNames : null,
        getLatestValueWithTs: isDefinedAndNotNull(configuration?.getLatestValueWithTs) ? configuration.getLatestValueWithTs : false
      };
      delete configuration.clientAttributeNames;
      delete configuration.latestTsKeyNames;
      delete configuration.serverAttributeNames;
      delete configuration.sharedAttributeNames;
      delete configuration.getLatestValueWithTs;

      if (isUndefinedOrNull(configuration?.fetchTo)) {
        configuration.fetchTo = false;
      }
    }
    return configuration;
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    for (const key of Object.keys(configuration.attributesControl)) {
      configuration[key] = configuration.attributesControl[key];
    }
    delete configuration.attributesControl;
    return configuration;
  }
}
