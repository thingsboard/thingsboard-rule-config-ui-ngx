import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/core.state';
import { SubscriptSizing } from '@angular/material/form-field';
import { coerceBoolean, PageComponent } from '@shared/public-api';

@Component({
  selector: 'tb-output-message-type-autocomplete',
  templateUrl: './output-message-type-autocomplete.component.html',
  styleUrls: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OutputMessageTypeAutocompleteComponent),
    multi: true
  }]
})

export class OutputMessageTypeAutocompleteComponent extends PageComponent implements OnInit, ControlValueAccessor {

  @ViewChild('messageTypeInput', {static: true}) messageTypeInput: ElementRef;

  @Input() autocompleteHint: string;

  @Input()
  subscriptSizing: SubscriptSizing = 'fixed';

  @Input()
  @coerceBoolean()
  set required(value) {
    if (this.requiredValue !== value) {
      this.requiredValue = value;
      this.updateValidators();
    }
  }

  get required() {
    return this.requiredValue;
  }

  messageTypeFormGroup: FormGroup;
  outputMessageTypes: Observable<Array<string>>;
  searchText = '';

  private modelValue: string | null;
  private dirty = false;
  private requiredValue: boolean;
  private messageTypes = ['POST_ATTRIBUTES_REQUEST', 'POST_TELEMETRY_REQUEST'];
  private propagateChange = (v: any) => { };

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
    this.messageTypeFormGroup = this.fb.group({
      messageType: [null, [Validators.maxLength(256)]]
    });
  }

  registerOnTouched(fn: any): void {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  ngOnInit() {
    this.outputMessageTypes = this.messageTypeFormGroup.get('messageType').valueChanges
      .pipe(
        tap(value => {
          this.updateView(value);
        }),
        map(value => value ? value : ''),
        mergeMap(type => this.fetchMessageTypes(type))
      );
  }

  writeValue(value: string | null): void {
    this.searchText = '';
    this.modelValue = value;
    this.messageTypeFormGroup.get('messageType').patchValue(value, {emitEvent: false});
    this.dirty = true;
  }

  onFocus() {
    if (this.dirty) {
      this.messageTypeFormGroup.get('messageType').updateValueAndValidity({onlySelf: true, emitEvent: true});
      this.dirty = false;
    }
  }

  updateView(value: string | null) {
    if (this.modelValue !== value) {
      this.modelValue = value;
      this.propagateChange(this.modelValue);
    }
  }

  displayMessageTypeFn(messageType?: string): string | undefined {
    return messageType ? messageType : undefined;
  }

  fetchMessageTypes(searchText?: string, strictMatch: boolean = false): Observable<Array<string>> {
    this.searchText = searchText;
    return of(this.messageTypes).pipe(
      map(messageTypes => messageTypes.filter(messageType => {
        if (strictMatch) {
          return searchText ? messageType === searchText : false;
        } else {
          return searchText ? messageType.toUpperCase().startsWith(searchText.toUpperCase()) : true;
        }
      }))
    );
  }

  clear() {
    this.messageTypeFormGroup.get('messageType').patchValue(null, {emitEvent: true});
    setTimeout(() => {
      this.messageTypeInput.nativeElement.blur();
      this.messageTypeInput.nativeElement.focus();
    }, 0);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.messageTypeFormGroup.disable({emitEvent: false});
    } else {
      this.messageTypeFormGroup.enable({emitEvent: false});
    }
  }

  private updateValidators() {
    this.messageTypeFormGroup.get('messageType').setValidators(
        this.required ? [Validators.required, Validators.maxLength(256)] : [Validators.maxLength(256)]
    );
    this.messageTypeFormGroup.get('messageType').updateValueAndValidity({emitEvent: false});
  }

}
