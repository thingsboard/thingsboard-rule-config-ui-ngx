import { Component, OnDestroy } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DataToFetch,
  FetchTo,
  OriginatorFields,
  originatorFieldsTranslations
} from '../../rulenode-core-config.models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-enrichment-node-related-attributes-config',
  templateUrl: './related-attributes-config.component.html',
  styleUrls: ['./related-attributes-config.component.scss']
})
export class RelatedAttributesConfigComponent extends RuleNodeConfigurationComponent implements OnDestroy {

  relatedAttributesConfigForm: FormGroup;

  protected readonly DataToFetch = DataToFetch;
  protected readonly originatorFieldsTranslations = originatorFieldsTranslations;

  public originatorFields: OriginatorFields[] = [];
  public fetchToData = [
    {
      name: this.translate.instant('tb.rulenode.attributes'),
      value: DataToFetch.ATTRIBUTES
    },
    {
      name: this.translate.instant('tb.rulenode.latest-telemetry'),
      value: DataToFetch.LATEST_TELEMETRY
    },
    {
      name: this.translate.instant('tb.rulenode.fields'),
      value: DataToFetch.FIELDS
    }
  ];

  private destroy$ = new Subject<void>();
  private defaultKvMap = {
    serialNumber: 'sn'
  };
  private defaultSvMap = {
    name: 'relatedEntityName'
  };

  private dataToFetchPrevValue = '';

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private translate: TranslateService) {
    super(store);
    for (const field of Object.keys(OriginatorFields)) {
      this.originatorFields.push(OriginatorFields[field]);
    }
  }

  public toggleChange(value) {
    this.relatedAttributesConfigForm.get('dataToFetch').patchValue(value, {emitEvent: true});
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

    if (isDefinedAndNotNull(configuration?.telemetry)) {
      this.dataToFetchPrevValue = configuration.telemetry ? DataToFetch.LATEST_TELEMETRY : DataToFetch.ATTRIBUTES;
    } else {
      this.dataToFetchPrevValue = isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : DataToFetch.ATTRIBUTES;
    }

    let dataMapping;
    if (isDefinedAndNotNull(configuration?.attrMapping)) {
      dataMapping = configuration.attrMapping;
    } else {
      dataMapping = isDefinedAndNotNull(configuration?.dataMapping) ? configuration.dataMapping : null;
    }

    return {
      relationsQuery: isDefinedAndNotNull(configuration?.relationsQuery) ? configuration.relationsQuery : null,
      dataToFetch: this.dataToFetchPrevValue,
      dataMapping,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  public selectTranslation(latestTelemetryTranslation, attributesTranslation) {
    if (this.relatedAttributesConfigForm.get('dataToFetch').value === DataToFetch.LATEST_TELEMETRY) {
      return latestTelemetryTranslation;
    } else {
      return attributesTranslation;
    }
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
