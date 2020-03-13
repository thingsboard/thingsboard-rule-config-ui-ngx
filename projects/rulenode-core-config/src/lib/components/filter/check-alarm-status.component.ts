import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@core/public-api';
import { AlarmStatus, alarmStatusTranslations, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, mergeMap, share, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'tb-filter-node-check-alarm-status-config',
  templateUrl: './check-alarm-status.component.html',
  styleUrls: []
})
export class CheckAlarmStatusComponent extends RuleNodeConfigurationComponent implements OnInit {

  @ViewChild('alarmStatusInput', {static: false}) alarmStatusInput: ElementRef<HTMLInputElement>;


  alarmStatusConfigForm: FormGroup;
  statusFormControl: FormControl;

  alarmStatusTranslationsMap = alarmStatusTranslations;

  filteredAlarmStatus: Observable<Array<AlarmStatus>>;

  private alarmStatusList: AlarmStatus[] = [];

  searchText = '';

  displayStatusFn = this.displayStatus.bind(this);

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {
    super(store);
    for (const field of Object.keys(AlarmStatus)) {
      this.alarmStatusList.push(AlarmStatus[field]);
    }
    this.statusFormControl = new FormControl('');
    this.filteredAlarmStatus = this.statusFormControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => value ? value : ''),
        mergeMap(name => this.fetchAlarmStatus(name)),
        share()
      );
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected configForm(): FormGroup {
    return this.alarmStatusConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    this.searchText = '';
    this.statusFormControl.patchValue('', {emitEvent: true});
    return configuration;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.alarmStatusConfigForm = this.fb.group({
      alarmStatusList: [configuration ? configuration.alarmStatusList : null, [Validators.required]],
    });
  }

  displayStatus(status?: AlarmStatus): string | undefined {
    return status ? this.translate.instant(alarmStatusTranslations.get(status)) : undefined;
  }

  private fetchAlarmStatus(searchText?: string): Observable<Array<AlarmStatus>> {
    const alarmStatusList = this.getAlarmStatusList();
    this.searchText = searchText;
    if (this.searchText && this.searchText.length) {
      const search = this.searchText.toUpperCase();
      return of(alarmStatusList.filter(field =>
        this.translate.instant(alarmStatusTranslations.get(AlarmStatus[field])).toUpperCase().includes(search)));
    } else {
      return of(alarmStatusList);
    }
  }

  alarmStatusSelected(event: MatAutocompleteSelectedEvent): void {
    this.addAlarmStatus(event.option.value);
    this.clear('');
  }

  removeAlarmStatus(status: AlarmStatus) {
    const alarmStatusList: AlarmStatus[] = this.alarmStatusConfigForm.get('alarmStatusList').value;
    if (alarmStatusList) {
      const index = alarmStatusList.indexOf(status);
      if (index >= 0) {
        alarmStatusList.splice(index, 1);
        this.alarmStatusConfigForm.get('alarmStatusList').setValue(alarmStatusList);
      }
    }
  }

  addAlarmStatus(status: AlarmStatus): void {
    let alarmStatusList: AlarmStatus[] = this.alarmStatusConfigForm.get('alarmStatusList').value;
    if (!alarmStatusList) {
      alarmStatusList = [];
    }
    const index = alarmStatusList.indexOf(status);
    if (index === -1) {
      alarmStatusList.push(status);
      this.alarmStatusConfigForm.get('alarmStatusList').setValue(alarmStatusList);
    }
  }

  private getAlarmStatusList(): Array<AlarmStatus> {
    return this.alarmStatusList.filter((listItem) => {
      return this.alarmStatusConfigForm.get('alarmStatusList').value.indexOf(listItem) === -1;
    });
  }

  onAlarmStatusInputFocus() {
    this.statusFormControl.updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  clear(value: string = '') {
    this.alarmStatusInput.nativeElement.value = value;
    this.statusFormControl.patchValue(null, {emitEvent: true});
    setTimeout(() => {
      this.alarmStatusInput.nativeElement.blur();
      this.alarmStatusInput.nativeElement.focus();
    }, 0);
  }
}

