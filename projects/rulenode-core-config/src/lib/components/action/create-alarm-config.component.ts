import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import {
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  JsFuncComponent,
  AlarmSeverity,
  alarmSeverityTranslations
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'tb-action-node-create-alarm-config',
  templateUrl: './create-alarm-config.component.html',
  styleUrls: []
})
export class CreateAlarmConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  @ViewChild('jsFuncComponent', {static: true}) jsFuncComponent: JsFuncComponent;

  alarmSeverities = Object.keys(AlarmSeverity);
  alarmSeverityTranslationMap = alarmSeverityTranslations;

  createAlarmConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
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
    this.createAlarmConfigForm = this.fb.group({
      alarmDetailsBuildJs: [configuration ? configuration.alarmDetailsBuildJs : null, [Validators.required]],
      useMessageAlarmData: [configuration ? configuration.useMessageAlarmData : false, []],
      alarmType: [configuration ? configuration.alarmType : null, []],
      severity: [configuration ? configuration.severity : null, []],
      propagate: [configuration ? configuration.propagate : false, []],
      relationTypes: [configuration ? configuration.relationTypes : null, []]
    });
    this.updateValidators(false);
    this.createAlarmConfigForm.get('useMessageAlarmData').valueChanges.subscribe(() => {
      this.updateValidators(true);
    });
    this.createAlarmConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.validateConfig()) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private updateValidators(emitEvent: boolean) {
    const useMessageAlarmData: boolean = this.createAlarmConfigForm.get('useMessageAlarmData').value;
    if (useMessageAlarmData) {
      this.createAlarmConfigForm.get('alarmType').setValidators([]);
      this.createAlarmConfigForm.get('severity').setValidators([]);
    } else {
      this.createAlarmConfigForm.get('alarmType').setValidators([Validators.required]);
      this.createAlarmConfigForm.get('severity').setValidators([Validators.required]);
    }
    this.createAlarmConfigForm.get('alarmType').updateValueAndValidity({emitEvent});
    this.createAlarmConfigForm.get('severity').updateValueAndValidity({emitEvent});
  }

  private validateConfig(): boolean {
    return this.createAlarmConfigForm.valid;
  }

  testScript() {
    const script: string = this.createAlarmConfigForm.get('alarmDetailsBuildJs').value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'json',
      this.translate.instant('tb.rulenode.details'),
      'Details',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId
    ).subscribe((theScript) => {
      if (theScript) {
        this.createAlarmConfigForm.get('alarmDetailsBuildJs').setValue(theScript);
      }
    });
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.createAlarmConfigForm.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.createAlarmConfigForm.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.createAlarmConfigForm.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.createAlarmConfigForm.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }

  protected onValidate() {
    this.jsFuncComponent.validateOnSubmit();
  }
}
