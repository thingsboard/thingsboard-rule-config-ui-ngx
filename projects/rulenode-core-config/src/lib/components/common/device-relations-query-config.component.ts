import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { EntitySearchDirection, entitySearchDirectionTranslations, EntityType, PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

interface DeviceRelationsQuery {
  fetchLastLevelOnly: boolean;
  direction: EntitySearchDirection;
  maxLevel?: number;
  relationType?: string;
  deviceTypes: string[];
}

@Component({
  selector: 'tb-device-relations-query-config',
  templateUrl: './device-relations-query-config.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeviceRelationsQueryConfigComponent),
      multi: true
    }
  ]
})
export class DeviceRelationsQueryConfigComponent extends PageComponent implements ControlValueAccessor, OnInit {

  @Input() disabled: boolean;

  private requiredValue: boolean;
  get required(): boolean {
    return this.requiredValue;
  }
  @Input()
  set required(value: boolean) {
    this.requiredValue = coerceBooleanProperty(value);
  }

  directionTypes = Object.keys(EntitySearchDirection);
  directionTypeTranslations = entitySearchDirectionTranslations;

  entityType = EntityType;

  deviceRelationsQueryFormGroup: FormGroup;

  private propagateChange = null;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.deviceRelationsQueryFormGroup = this.fb.group({
      fetchLastLevelOnly: [false, []],
      direction: [null, [Validators.required]],
      maxLevel: [null, []],
      relationType: [null],
      deviceTypes: [null, [Validators.required]]
    });
    this.deviceRelationsQueryFormGroup.valueChanges.subscribe((query: DeviceRelationsQuery) => {
      if (this.deviceRelationsQueryFormGroup.valid) {
        this.propagateChange(query);
      } else {
        this.propagateChange(null);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.deviceRelationsQueryFormGroup.disable({emitEvent: false});
    } else {
      this.deviceRelationsQueryFormGroup.enable({emitEvent: false});
    }
  }

  writeValue(query: DeviceRelationsQuery): void {
    this.deviceRelationsQueryFormGroup.reset(query, {emitEvent: false});
  }
}
