import { Component, EventEmitter, ViewChild } from '@angular/core';
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

@Component({
  selector: 'tb-action-node-log-config',
  templateUrl: './log-config.component.html',
  styleUrls: []
})
export class LogConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('tbelFuncComponent', {static: false}) tbelFuncComponent: JsFuncComponent;

  logConfigForm: UntypedFormGroup;

  tbelEnabled = getCurrentAuthState(this.store).tbelEnabled;

  scriptLanguage = ScriptLanguage;

  changeScript: EventEmitter<void> = new EventEmitter<void>();

  readonly hasScript = true;

  readonly testScriptLabel = 'tb.rulenode.test-to-string-function';

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.logConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.logConfigForm = this.fb.group({
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, []],
      tbelScript: [configuration ? configuration.tbelScript : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.logConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.TBEL && !this.tbelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.logConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.logConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.logConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.logConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.logConfigForm.get('tbelScript').setValidators(scriptLang === ScriptLanguage.TBEL ? [Validators.required] : []);
    this.logConfigForm.get('tbelScript').updateValueAndValidity({emitEvent});
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (configuration) {
      if (!configuration.scriptLang) {
        configuration.scriptLang = ScriptLanguage.JS;
      }
    }
    return configuration;
  }

  testScript(debugEventBody?: DebugRuleNodeEventBody) {
    const scriptLang: ScriptLanguage = this.logConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'jsScript' : 'tbelScript';
    const helpId = scriptLang === ScriptLanguage.JS ? 'rulenode/log_node_script_fn' : 'rulenode/tbel/log_node_script_fn';
    const script: string = this.logConfigForm.get(scriptField).value;
    return this.nodeScriptTestService.testNodeScript(
      script,
      'string',
      this.translate.instant('tb.rulenode.to-string'),
      'ToString',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      helpId,
      scriptLang,
      debugEventBody
    ).subscribe((theScript) => {
      if (theScript) {
        this.logConfigForm.get(scriptField).setValue(theScript);
        this.changeScript.emit();
      }
    })
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.logConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.JS) {
      this.jsFuncComponent.validateOnSubmit();
    }
  }
}
