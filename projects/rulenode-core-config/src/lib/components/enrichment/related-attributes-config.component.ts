import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FetchTo } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-related-attributes-config',
  templateUrl: './related-attributes-config.component.html',
  styleUrls: []
})
export class RelatedAttributesConfigComponent extends RuleNodeConfigurationComponent {

  relatedAttributesConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.relatedAttributesConfigForm;
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    const filteAttrMapping = {};
    for (const key of Object.keys(configuration.attrMapping)) {
      filteAttrMapping[key.trim()] = configuration.attrMapping[key].trim();
    }
    configuration.attrMapping = filteAttrMapping;
    return configuration;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.relatedAttributesConfigForm = this.fb.group({
      relationsQuery: [isDefinedAndNotNull(configuration?.relationsQuery) ? configuration.relationsQuery : null, [Validators.required]],
      telemetry: [isDefinedAndNotNull(configuration?.telemetry) ? configuration.telemetry : false, []],
      attrMapping: [isDefinedAndNotNull(configuration?.attrMapping) ? configuration.attrMapping : null, [Validators.required]],
      fetchTo: [isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA]
    });
  }
}
