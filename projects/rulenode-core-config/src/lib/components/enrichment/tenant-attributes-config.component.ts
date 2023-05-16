import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DataToFetch, FetchTo } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-tenant-attributes-config',
  templateUrl: './tenant-attributes-config.component.html',
  styleUrls: []
})
export class TenantAttributesConfigComponent extends RuleNodeConfigurationComponent {

  tenantAttributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.tenantAttributesConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      dataToFetch: isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : DataToFetch.ATTRIBUTES,
      attrMapping: isDefinedAndNotNull(configuration?.attrMapping)  ? configuration.attrMapping : null,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.tenantAttributesConfigForm = this.fb.group({
      dataToFetch: [configuration.dataToFetch, []],
      attrMapping: [configuration.attrMapping, [Validators.required]],
      fetchTo: [configuration.fetchTo, []]
    });
  }

  protected readonly DataToFetch = DataToFetch;
}
