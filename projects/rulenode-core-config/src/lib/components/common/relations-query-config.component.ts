import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { EntitySearchDirection, entitySearchDirectionTranslations, PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { RelationsQuery } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-relations-query-config',
  templateUrl: './relations-query-config.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RelationsQueryConfigComponent),
      multi: true
    }
  ]
})
export class RelationsQueryConfigComponent extends PageComponent implements ControlValueAccessor, OnInit {

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

  relationsQueryFormGroup: FormGroup;

  private propagateChange = null;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.relationsQueryFormGroup = this.fb.group({
      fetchLastLevelOnly: [false, []],
      direction: [null, [Validators.required]],
      maxLevel: [null, []],
      filters: [null]
    });
    this.relationsQueryFormGroup.valueChanges.subscribe((query: RelationsQuery) => {
      if (this.relationsQueryFormGroup.valid) {
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
      this.relationsQueryFormGroup.disable({emitEvent: false});
    } else {
      this.relationsQueryFormGroup.enable({emitEvent: false});
    }
  }

  writeValue(query: RelationsQuery): void {
    this.relationsQueryFormGroup.reset(query || {}, {emitEvent: false});
  }
}
