import { Component, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, NodeScriptTestService } from '@core/public-api';
import { JsFuncComponent, RuleNodeConfiguration, RuleNodeConfigurationComponent, ScriptLanguage } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-log-config',
  templateUrl: './log-config.component.html',
  styleUrls: []
})
export class LogConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('mvelFuncComponent', {static: false}) mvelFuncComponent: JsFuncComponent;

  logConfigForm: FormGroup;

  mvelEnabled = getCurrentAuthState(this.store).mvelEnabled;

  scriptLanguage = ScriptLanguage;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.logConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.logConfigForm = this.fb.group({
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, []],
      mvelScript: [configuration ? configuration.mvelScript : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.logConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.MVEL && !this.mvelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.logConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.logConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.logConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.logConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.logConfigForm.get('mvelScript').setValidators(scriptLang === ScriptLanguage.MVEL ? [Validators.required] : []);
    this.logConfigForm.get('mvelScript').updateValueAndValidity({emitEvent});
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (configuration) {
      if (!configuration.scriptLang) {
        configuration.scriptLang = ScriptLanguage.JS;
      }
    }
    return configuration;
  }

  testScript() {
    const scriptLang: ScriptLanguage = this.logConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'jsScript' : 'mvelScript';
    const script: string = this.logConfigForm.get(scriptField).value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'string',
      this.translate.instant('tb.rulenode.to-string'),
      'ToString',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      'rulenode/log_node_script_fn',
      scriptLang
    ).subscribe((theScript) => {
      if (theScript) {
        this.logConfigForm.get(scriptField).setValue(theScript);
      }
    });
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.logConfigForm.get('scriptLang').value;
    const component = scriptLang === ScriptLanguage.JS ? this.jsFuncComponent : this.mvelFuncComponent;
    component.validateOnSubmit();
  }
}
