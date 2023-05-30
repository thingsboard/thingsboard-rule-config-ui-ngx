import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-select-attributes',
  templateUrl: './select-attributes.component.html',
  styleUrls: ['./select-attributes.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectAttributesComponent),
    multi: true
  }]
})

export class SelectAttributesComponent implements  OnInit, ControlValueAccessor, OnDestroy {

  private propagateChange;
  private destroy$ = new Subject();

  public attributeControlGroup: FormGroup;
  public separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  @Input() popupHelpLink: string;

  constructor(private store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.attributeControlGroup = this.fb.group({
      clientAttributeNames: [null, []],
      sharedAttributeNames: [null, []],
      serverAttributeNames: [ null, []],
      latestTsKeyNames: [null, []],
      getLatestValueWithTs: [false, []]
    });

    this.attributeControlGroup.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        this.propagateChange(value);
      }
    );
  }

  writeValue(value: object): void {
    this.attributeControlGroup.patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.attributeControlGroup.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.attributeControlGroup.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.attributeControlGroup.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.attributeControlGroup.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }

  clearChipGrid(keysField) {
    this.attributeControlGroup.get(keysField).patchValue([], {emitEvent: true});
  }
}
