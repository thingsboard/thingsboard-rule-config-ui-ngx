import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataToFetch, FetchTo } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-tenant-attributes-config',
  templateUrl: './tenant-attributes-config.component.html',
  styleUrls: []
})
export class TenantAttributesConfigComponent extends RuleNodeConfigurationComponent {

  tenantAttributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.tenantAttributesConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      dataToFetch: isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : DataToFetch.ATTRIBUTES,
      dataMapping: isDefinedAndNotNull(configuration?.dataMapping)  ? configuration.dataMapping : null,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  public selectTranslation(latestTelemetryTranslation, attributesTranslation) {
    if (this.tenantAttributesConfigForm.get('dataToFetch').value === DataToFetch.LATEST_TELEMETRY) {
      return latestTelemetryTranslation;
    } else {
      return attributesTranslation;
    }
  }


  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.tenantAttributesConfigForm = this.fb.group({
      dataToFetch: [configuration.dataToFetch, []],
      dataMapping: [configuration.dataMapping, [Validators.required]],
      fetchTo: [configuration.fetchTo, []]
    });
  }

  protected readonly DataToFetch = DataToFetch;
}
