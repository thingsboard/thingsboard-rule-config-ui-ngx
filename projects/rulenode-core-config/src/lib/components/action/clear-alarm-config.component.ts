import { Component, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, NodeScriptTestService } from '@core/public-api';
import {
  DebugRuleNodeEventBody,
  JsFuncComponent,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  ScriptLanguage
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'tb-action-node-clear-alarm-config',
  templateUrl: './clear-alarm-config.component.html',
  styleUrls: []
})
export class ClearAlarmConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('tbelFuncComponent', {static: false}) tbelFuncComponent: JsFuncComponent;

  clearAlarmConfigForm: UntypedFormGroup;

  tbelEnabled = getCurrentAuthState(this.store).tbelEnabled;

  scriptLanguage = ScriptLanguage;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.clearAlarmConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.clearAlarmConfigForm = this.fb.group({
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      alarmDetailsBuildJs: [configuration ? configuration.alarmDetailsBuildJs : null, []],
      alarmDetailsBuildTbel: [configuration ? configuration.alarmDetailsBuildTbel : null, []],
      alarmType: [configuration ? configuration.alarmType : null, [Validators.required]]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.clearAlarmConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.TBEL && !this.tbelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.clearAlarmConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.clearAlarmConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.clearAlarmConfigForm.get('alarmDetailsBuildJs').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.clearAlarmConfigForm.get('alarmDetailsBuildJs').updateValueAndValidity({emitEvent});
    this.clearAlarmConfigForm.get('alarmDetailsBuildTbel').setValidators(scriptLang === ScriptLanguage.TBEL ? [Validators.required] : []);
    this.clearAlarmConfigForm.get('alarmDetailsBuildTbel').updateValueAndValidity({emitEvent});
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (configuration) {
      if (!configuration.scriptLang) {
        configuration.scriptLang = ScriptLanguage.JS;
      }
    }
    return configuration;
  }

  protected testScript$(debugEventBody?: DebugRuleNodeEventBody): Observable<string> {
    const scriptLang: ScriptLanguage = this.clearAlarmConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'alarmDetailsBuildJs' : 'alarmDetailsBuildTbel';
    const helpId = scriptLang === ScriptLanguage.JS ? 'rulenode/clear_alarm_node_script_fn' : 'rulenode/tbel/clear_alarm_node_script_fn';
    const script: string = this.clearAlarmConfigForm.get(scriptField).value;
    return this.nodeScriptTestService.testNodeScript(
      script,
      'json',
      this.translate.instant('tb.rulenode.details'),
      'Details',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      helpId,
      scriptLang,
      debugEventBody
    ).pipe(
      tap((theScript) => {
        if (theScript) {
          this.clearAlarmConfigForm.get(scriptField).setValue(theScript);
        }
      }))
  }

  testScript() {
    this.testScript$().subscribe()
  }

  getSupportTestFunction() {
    return true;
  }

  getTestButtonLabel() {
    return this.translate.instant('tb.rulenode.test-details-function');
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.clearAlarmConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.JS) {
      this.jsFuncComponent.validateOnSubmit();
    }
  }
}
