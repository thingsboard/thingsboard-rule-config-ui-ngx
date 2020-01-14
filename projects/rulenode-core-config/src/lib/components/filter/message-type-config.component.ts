import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  LinkLabel,
  MessageType,
  messageTypeNames,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  TruncatePipe
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipList, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { map, mergeMap, share, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-filter-node-message-type-config',
  templateUrl: './message-type-config.component.html',
  styleUrls: []
})
export class MessageTypeConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  @ViewChild('chipList', {static: false}) chipList: MatChipList;
  @ViewChild('messageTypeAutocomplete', {static: false}) matAutocomplete: MatAutocomplete;
  @ViewChild('messageTypeInput', {static: false}) messageTypeInput: ElementRef<HTMLInputElement>;

  messageTypeConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  filteredMessageTypes: Observable<Array<LinkLabel>>;

  messageTypes: Array<LinkLabel> = [];

  private messageTypesList: Array<LinkLabel> = [];

  searchText = '';

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              public truncate: TruncatePipe,
              private fb: FormBuilder) {
    super(store);
    this.messageTypeConfigForm = this.fb.group({
      messageType: [null]
    });
    for (const type of Object.keys(MessageType)) {
      this.messageTypesList.push(
        {
          name: messageTypeNames.get(MessageType[type]),
          value: type
        }
      );
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.filteredMessageTypes = this.messageTypeConfigForm.get('messageType').valueChanges
      .pipe(
        startWith(''),
        map((value) => value ? value : ''),
        mergeMap(name => this.fetchMessageTypes(name) ),
        share()
      );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.messageTypes.length) {
        this.updateModel();
      }
    }, 0);
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.searchText = '';
    this.messageTypes.length = 0;
    if (configuration && configuration.messageTypes) {
      configuration.messageTypes.forEach((type: string) => {
        const found = this.messageTypesList.find((messageType => messageType.value === type));
        if (found) {
          this.messageTypes.push({
            name: found.name,
            value: found.value
          });
        } else {
          this.messageTypes.push({
            name: type,
            value: type
          });
        }
      });
    }
    this.messageTypeConfigForm.get('messageType').patchValue('', {emitEvent: true});
  }

  displayMessageTypeFn(messageType?: LinkLabel): string | undefined {
    return messageType ? messageType.name : undefined;
  }

  textIsNotEmpty(text: string): boolean {
    return (text && text != null && text.length > 0) ? true : false;
  }

  createMessageType($event: Event, value: string) {
    $event.preventDefault();
    this.transformMessageType(value);
  }

  add(event: MatChipInputEvent): void {
    this.transformMessageType(event.value);
  }

  private fetchMessageTypes(searchText?: string): Observable<Array<LinkLabel>> {
    this.searchText = searchText;
    if (this.searchText && this.searchText.length) {
      const search = this.searchText.toUpperCase();
      return of(this.messageTypesList.filter(messageType => messageType.name.toUpperCase().includes(search)));
    } else {
      return of(this.messageTypesList);
    }
  }

  private transformMessageType(value: string) {
    if ((value || '').trim()) {
      let newMessageType: LinkLabel = null;
      const messageTypeName = value.trim();
      const existingMessageType = this.messageTypesList.find(messageType => messageType.name === messageTypeName);
      if (existingMessageType) {
        newMessageType = {
          name: existingMessageType.name,
          value: existingMessageType.value
        };
      } else {
        newMessageType = {
          name: messageTypeName,
          value: messageTypeName
        };
      }
      if (newMessageType) {
        this.addMessageType(newMessageType);
      }
    }
    this.clear('');
  }

  remove(messageType: LinkLabel) {
    const index = this.messageTypes.indexOf(messageType);
    if (index >= 0) {
      this.messageTypes.splice(index, 1);
      this.updateModel();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addMessageType(event.option.value);
    this.clear('');
  }

  addMessageType(messageType: LinkLabel): void {
    const index = this.messageTypes.findIndex(existingMessageType => existingMessageType.value === messageType.value);
    if (index === -1) {
      this.messageTypes.push(messageType);
      this.updateModel();
    }
  }

  clear(value: string = '') {
    this.messageTypeInput.nativeElement.value = value;
    this.messageTypeConfigForm.get('messageType').patchValue(null, {emitEvent: true});
    setTimeout(() => {
      this.messageTypeInput.nativeElement.blur();
      this.messageTypeInput.nativeElement.focus();
    }, 0);
  }

  private updateModel() {
    if (this.messageTypes.length) {
      this.chipList.errorState = false;
      const configuration: RuleNodeConfiguration = { messageTypes: this.messageTypes.map((messageType => messageType.value)) };
      this.notifyConfigurationUpdated(configuration);
    } else {
      this.chipList.errorState = true;
      this.notifyConfigurationUpdated(null);
    }
  }

}
