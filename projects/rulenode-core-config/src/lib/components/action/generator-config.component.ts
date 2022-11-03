import { Component, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, NodeScriptTestService } from '@core/public-api';
import { JsFuncComponent, RuleNodeConfiguration, RuleNodeConfigurationComponent, ScriptLanguage } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-generator-config',
  templateUrl: './generator-config.component.html',
  styleUrls: []
})
export class GeneratorConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('mvelFuncComponent', {static: false}) mvelFuncComponent: JsFuncComponent;

  generatorConfigForm: FormGroup;

  mvelEnabled = getCurrentAuthState(this.store).mvelEnabled;

  scriptLanguage = ScriptLanguage;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.generatorConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.generatorConfigForm = this.fb.group({
      msgCount: [configuration ? configuration.msgCount : null, [Validators.required, Validators.min(0)]],
      periodInSeconds: [configuration ? configuration.periodInSeconds : null, [Validators.required, Validators.min(1)]],
      originator: [configuration ? configuration.originator : null, []],
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, []],
      mvelScript: [configuration ? configuration.mvelScript : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.generatorConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.MVEL && !this.mvelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.generatorConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.generatorConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.generatorConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.generatorConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.generatorConfigForm.get('mvelScript').setValidators(scriptLang === ScriptLanguage.MVEL ? [Validators.required] : []);
    this.generatorConfigForm.get('mvelScript').updateValueAndValidity({emitEvent});
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (configuration) {
      if (!configuration.scriptLang) {
        configuration.scriptLang = ScriptLanguage.JS;
      }
      if (configuration.originatorId && configuration.originatorType) {
        configuration.originator = {
          id: configuration.originatorId, entityType: configuration.originatorType
        };
      } else {
        configuration.originator = null;
      }
      delete configuration.originatorId;
      delete configuration.originatorType;
    }
    return configuration;
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (configuration.originator) {
      configuration.originatorId = configuration.originator.id;
      configuration.originatorType = configuration.originator.entityType;
    } else {
      configuration.originatorId = null;
      configuration.originatorType = null;
    }
    delete configuration.originator;
    return configuration;
  }

  testScript() {
    const scriptLang: ScriptLanguage = this.generatorConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'jsScript' : 'mvelScript';
    const script: string = this.generatorConfigForm.get(scriptField).value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'generate',
      this.translate.instant('tb.rulenode.generator'),
      'Generate',
      ['prevMsg', 'prevMetadata', 'prevMsgType'],
      this.ruleNodeId,
      'rulenode/generator_node_script_fn',
      scriptLang
    ).subscribe((theScript) => {
      if (theScript) {
        this.generatorConfigForm.get(scriptField).setValue(theScript);
      }
    });
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.generatorConfigForm.get('scriptLang').value;
    const component = scriptLang === ScriptLanguage.JS ? this.jsFuncComponent : this.mvelFuncComponent;
    component.validateOnSubmit();
  }
}
