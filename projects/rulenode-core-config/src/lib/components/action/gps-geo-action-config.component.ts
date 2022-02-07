import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import {
  PerimeterType,
  perimeterTypeTranslations,
  RangeUnit,
  rangeUnitTranslations,
  TimeUnit,
  timeUnitTranslations
} from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-gps-geofencing-config',
  templateUrl: './gps-geo-action-config.component.html',
  styleUrls: []
})
export class GpsGeoActionConfigComponent extends RuleNodeConfigurationComponent {

  geoActionConfigForm: FormGroup;

  perimeterType = PerimeterType;
  perimeterTypes = Object.keys(PerimeterType);
  perimeterTypeTranslationMap = perimeterTypeTranslations;

  rangeUnits = Object.keys(RangeUnit);
  rangeUnitTranslationMap = rangeUnitTranslations;

  timeUnits = Object.keys(TimeUnit);
  timeUnitsTranslationMap = timeUnitTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.geoActionConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.geoActionConfigForm = this.fb.group({
      latitudeKeyName: [configuration ? configuration.latitudeKeyName : null, [Validators.required]],
      longitudeKeyName: [configuration ? configuration.longitudeKeyName : null, [Validators.required]],
      perimeterType: [configuration ? configuration.perimeterType : null, [Validators.required]],
      fetchPerimeterInfoFromMessageMetadata: [configuration ? configuration.fetchPerimeterInfoFromMessageMetadata : false, []],
      perimeterKeyName: [configuration ? configuration.perimeterKeyName : null, []],
      centerLatitude: [configuration ? configuration.centerLatitude : null, []],
      centerLongitude: [configuration ? configuration.centerLatitude : null, []],
      range: [configuration ? configuration.range : null, []],
      rangeUnit: [configuration ? configuration.rangeUnit : null, []],
      polygonsDefinition: [configuration ? configuration.polygonsDefinition : null, []],
      minInsideDuration: [configuration ? configuration.minInsideDuration : null,
        [Validators.required, Validators.min(1), Validators.max(2147483647)]],
      minInsideDurationTimeUnit: [configuration ? configuration.minInsideDurationTimeUnit : null, [Validators.required]],
      minOutsideDuration: [configuration ? configuration.minOutsideDuration : null,
        [Validators.required, Validators.min(1), Validators.max(2147483647)]],
      minOutsideDurationTimeUnit: [configuration ? configuration.minOutsideDurationTimeUnit : null, [Validators.required]],
    });
  }

  protected validatorTriggers(): string[] {
    return ['fetchPerimeterInfoFromMessageMetadata', 'perimeterType'];
  }

  protected updateValidators(emitEvent: boolean) {
    const fetchPerimeterInfoFromMessageMetadata: boolean = this.geoActionConfigForm.get('fetchPerimeterInfoFromMessageMetadata').value;
    const perimeterType: PerimeterType = this.geoActionConfigForm.get('perimeterType').value;
    if (fetchPerimeterInfoFromMessageMetadata) {
      this.geoActionConfigForm.get('perimeterKeyName').setValidators([Validators.required]);
    } else {
      this.geoActionConfigForm.get('perimeterKeyName').setValidators([]);
    }
    if (!fetchPerimeterInfoFromMessageMetadata && perimeterType === PerimeterType.CIRCLE) {
      this.geoActionConfigForm.get('centerLatitude').setValidators([Validators.required,
        Validators.min(-90), Validators.max(90)]);
      this.geoActionConfigForm.get('centerLongitude').setValidators([Validators.required,
        Validators.min(-180), Validators.max(180)]);
      this.geoActionConfigForm.get('range').setValidators([Validators.required, Validators.min(0)]);
      this.geoActionConfigForm.get('rangeUnit').setValidators([Validators.required]);
    } else {
      this.geoActionConfigForm.get('centerLatitude').setValidators([]);
      this.geoActionConfigForm.get('centerLongitude').setValidators([]);
      this.geoActionConfigForm.get('range').setValidators([]);
      this.geoActionConfigForm.get('rangeUnit').setValidators([]);
    }
    if (!fetchPerimeterInfoFromMessageMetadata && perimeterType === PerimeterType.POLYGON) {
      this.geoActionConfigForm.get('polygonsDefinition').setValidators([Validators.required]);
    } else {
      this.geoActionConfigForm.get('polygonsDefinition').setValidators([]);
    }
    this.geoActionConfigForm.get('perimeterKeyName').updateValueAndValidity({emitEvent});
    this.geoActionConfigForm.get('centerLatitude').updateValueAndValidity({emitEvent});
    this.geoActionConfigForm.get('centerLongitude').updateValueAndValidity({emitEvent});
    this.geoActionConfigForm.get('range').updateValueAndValidity({emitEvent});
    this.geoActionConfigForm.get('rangeUnit').updateValueAndValidity({emitEvent});
    this.geoActionConfigForm.get('polygonsDefinition').updateValueAndValidity({emitEvent});
  }
}
