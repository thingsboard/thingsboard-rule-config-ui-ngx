import { Component, OnDestroy } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  DataToFetch,
  FetchTo,
  OriginatorFields,
  originatorFieldsTranslations
} from '../../rulenode-core-config.models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tb-enrichment-node-related-attributes-config',
  templateUrl: './related-attributes-config.component.html',
  styleUrls: []
})
export class RelatedAttributesConfigComponent extends RuleNodeConfigurationComponent implements OnDestroy {

  relatedAttributesConfigForm: FormGroup;

  protected readonly DataToFetch = DataToFetch;
  protected readonly originatorFieldsTranslations = originatorFieldsTranslations;

  public originatorFields: OriginatorFields[] = [];

  private destroy$ = new Subject<void>();
  private defaultKvMap = {
    serialNumber: 'sn'
  };
  private defaultSvMap = {
    name: 'relatedEntityName',
    type: 'relatedEntityType'
  };

  private dataToFetchPrevValue = '';

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
    for (const field of Object.keys(OriginatorFields)) {
      this.originatorFields.push(OriginatorFields[field]);
    }
  }

  protected configForm(): FormGroup {
    return this.relatedAttributesConfigForm;
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    const filteDataMapping = {};
    for (const key of Object.keys(configuration.dataMapping)) {
      filteDataMapping[key.trim()] = configuration.dataMapping[key].trim();
    }
    configuration.dataMapping = filteDataMapping;
    return configuration;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    this.dataToFetchPrevValue = isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : DataToFetch.ATTRIBUTES;
    return {
      relationsQuery: isDefinedAndNotNull(configuration?.relationsQuery) ? configuration.relationsQuery : null,
      dataToFetch: this.dataToFetchPrevValue,
      dataMapping: isDefinedAndNotNull(configuration?.dataMapping) ? configuration.dataMapping : null,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.relatedAttributesConfigForm = this.fb.group({
      relationsQuery: [configuration.relationsQuery, [Validators.required]],
      dataToFetch: [configuration.dataToFetch, []],
      dataMapping: [configuration.dataMapping, [Validators.required]],
      fetchTo: [configuration.fetchTo, []]
    });

    this.relatedAttributesConfigForm.get('dataToFetch').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (value === DataToFetch.FIELDS) {
        this.relatedAttributesConfigForm.get('dataMapping').patchValue(this.defaultSvMap, {emitEvent: false});
      }
      if (value !== DataToFetch.FIELDS && this.dataToFetchPrevValue === DataToFetch.FIELDS) {
        this.relatedAttributesConfigForm.get('dataMapping').patchValue(this.defaultKvMap, {emitEvent: false});
      }
      this.dataToFetchPrevValue = value;
    });
  }

  public msgMetadataChipLabel(): string {
    switch (this.relatedAttributesConfigForm.get('dataToFetch').value) {
      case DataToFetch.ATTRIBUTES:
        return 'tb.rulenode.add-mapped-attribute-to';
      case DataToFetch.LATEST_TELEMETRY:
        return 'tb.rulenode.add-mapped-latest-telemetry-to';
      case DataToFetch.FIELDS:
        return 'tb.rulenode.add-mapped-fields-to';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
