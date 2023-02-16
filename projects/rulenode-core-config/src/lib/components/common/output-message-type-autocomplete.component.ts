import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/core.state';

@Component({
  selector: 'tb-output-message-type-autocomplete',
  templateUrl: './output-message-type-autocomplete.component.html',
  styleUrls: ['./output-message-type-autocomplete.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OutputMessageTypeAutocompleteComponent),
    multi: true
  }]
})

export class OutputMessageTypeAutocompleteComponent implements  OnInit {

  @ViewChild('messageTypeInput', {static: true}) messageTypeInput: ElementRef;

  @Input() autocompleteHint: string;

  messageTypeFormGroup: UntypedFormGroup;
  outputMessageTypes: Observable<Array<string>>;
  private modelValue: string | null;
  private searchText = '';
  private dirty = false;
  private messageTypes = ['POST_ATTRIBUTES_REQUEST', 'POST_TELEMETRY_REQUEST'];

  constructor(private store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    this.messageTypeFormGroup = this.fb.group({
      messageType: [null,  [Validators.required, Validators.maxLength(255)]]
    });
  }

  private propagateChange = (v: any) => { };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngOnInit() {
    this.outputMessageTypes = this.messageTypeFormGroup.get('messageType').valueChanges
      .pipe(
        tap(value => {
          this.updateView(value);
        }),
        map(value => value ? value : ''),
        mergeMap(type => this.fetchMessageTypes(type) )
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
      map(messageTypes => messageTypes.filter( messageType => {
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

}
