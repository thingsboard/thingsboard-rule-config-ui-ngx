import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { PerimeterType, perimeterTypeTranslations, RangeUnit, rangeUnitTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-filter-node-gps-geofencing-config',
  templateUrl: './gps-geo-filter-config.component.html',
  styleUrls: []
})
export class GpsGeoFilterConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  geoFilterConfigForm: FormGroup;

  perimeterType = PerimeterType;
  perimeterTypes = Object.keys(PerimeterType);
  perimeterTypeTranslationMap = perimeterTypeTranslations;

  rangeUnits = Object.keys(RangeUnit);
  rangeUnitTranslationMap = rangeUnitTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.validateConfig()) {
        this.notifyConfigurationUpdated(null);
      }
    }, 0);
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.geoFilterConfigForm = this.fb.group({
      latitudeKeyName: [configuration ? configuration.latitudeKeyName : null, [Validators.required]],
      longitudeKeyName: [configuration ? configuration.longitudeKeyName : null, [Validators.required]],
      fetchPerimeterInfoFromMessageMetadata: [configuration ? configuration.fetchPerimeterInfoFromMessageMetadata : false, []],
      perimeterType: [configuration ? configuration.perimeterType : null, []],
      centerLatitude: [configuration ? configuration.centerLatitude : null, []],
      centerLongitude: [configuration ? configuration.centerLatitude : null, []],
      range: [configuration ? configuration.range : null, []],
      rangeUnit: [configuration ? configuration.rangeUnit : null, []],
      polygonsDefinition: [configuration ? configuration.polygonsDefinition : null, []]
    });
    this.updateValidators(false);
    this.geoFilterConfigForm.get('fetchPerimeterInfoFromMessageMetadata').valueChanges.subscribe(
      () => {
        this.updateValidators(true);
      }
    );
    this.geoFilterConfigForm.get('perimeterType').valueChanges.subscribe(
      () => {
        this.updateValidators(true);
      }
    );
    this.geoFilterConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.validateConfig()) {
        this.notifyConfigurationUpdated(this.geoFilterConfigForm.value);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private updateValidators(emitEvent: boolean) {
    const fetchPerimeterInfoFromMessageMetadata: boolean = this.geoFilterConfigForm.get('fetchPerimeterInfoFromMessageMetadata').value;
    const perimeterType: PerimeterType = this.geoFilterConfigForm.get('perimeterType').value;
    if (fetchPerimeterInfoFromMessageMetadata) {
      this.geoFilterConfigForm.get('perimeterType').setValidators([]);
    } else {
      this.geoFilterConfigForm.get('perimeterType').setValidators([Validators.required]);
    }
    if (!fetchPerimeterInfoFromMessageMetadata && perimeterType === PerimeterType.CIRCLE) {
      this.geoFilterConfigForm.get('centerLatitude').setValidators([Validators.required]);
      this.geoFilterConfigForm.get('centerLongitude').setValidators([Validators.required]);
      this.geoFilterConfigForm.get('range').setValidators([Validators.required]);
      this.geoFilterConfigForm.get('rangeUnit').setValidators([Validators.required]);
    } else {
      this.geoFilterConfigForm.get('centerLatitude').setValidators([]);
      this.geoFilterConfigForm.get('centerLongitude').setValidators([]);
      this.geoFilterConfigForm.get('range').setValidators([]);
      this.geoFilterConfigForm.get('rangeUnit').setValidators([]);
    }
    if (!fetchPerimeterInfoFromMessageMetadata && perimeterType === PerimeterType.POLYGON) {
      this.geoFilterConfigForm.get('polygonsDefinition').setValidators([Validators.required]);
    } else {
      this.geoFilterConfigForm.get('polygonsDefinition').setValidators([]);
    }
    this.geoFilterConfigForm.get('perimeterType').updateValueAndValidity({emitEvent: false});
    this.geoFilterConfigForm.get('centerLatitude').updateValueAndValidity({emitEvent});
    this.geoFilterConfigForm.get('centerLongitude').updateValueAndValidity({emitEvent});
    this.geoFilterConfigForm.get('range').updateValueAndValidity({emitEvent});
    this.geoFilterConfigForm.get('rangeUnit').updateValueAndValidity({emitEvent});
    this.geoFilterConfigForm.get('polygonsDefinition').updateValueAndValidity({emitEvent});
  }

  private validateConfig(): boolean {
    return this.geoFilterConfigForm.valid;
  }
}
