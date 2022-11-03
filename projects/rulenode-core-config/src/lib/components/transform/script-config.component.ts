import { Component, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, NodeScriptTestService } from '@core/public-api';
import { JsFuncComponent, RuleNodeConfiguration, RuleNodeConfigurationComponent, ScriptLanguage } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-script-config',
  templateUrl: './script-config.component.html',
  styleUrls: []
})
export class TransformScriptConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('mvelFuncComponent', {static: false}) mvelFuncComponent: JsFuncComponent;

  scriptConfigForm: FormGroup;

  mvelEnabled = getCurrentAuthState(this.store).mvelEnabled;

  scriptLanguage = ScriptLanguage;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.scriptConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.scriptConfigForm = this.fb.group({
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, [Validators.required]],
      mvelScript: [configuration ? configuration.mvelScript : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.scriptConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.MVEL && !this.mvelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.scriptConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.scriptConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.scriptConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.scriptConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.scriptConfigForm.get('mvelScript').setValidators(scriptLang === ScriptLanguage.MVEL ? [Validators.required] : []);
    this.scriptConfigForm.get('mvelScript').updateValueAndValidity({emitEvent});
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
    const scriptLang: ScriptLanguage = this.scriptConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'jsScript' : 'mvelScript';
    const script: string = this.scriptConfigForm.get(scriptField).value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'update',
      this.translate.instant('tb.rulenode.transformer'),
      'Transform',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      'rulenode/transformation_node_script_fn',
      scriptLang
    ).subscribe((theScript) => {
      if (theScript) {
        this.scriptConfigForm.get(scriptField).setValue(theScript);
      }
    });
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.scriptConfigForm.get('scriptLang').value;
    const component = scriptLang === ScriptLanguage.JS ? this.jsFuncComponent : this.mvelFuncComponent;
    component.validateOnSubmit();
  }
}
