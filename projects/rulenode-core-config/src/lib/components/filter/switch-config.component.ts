import { Component, EventEmitter, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, NodeScriptTestService } from '@core/public-api';
import {
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  JsFuncComponent,
  ScriptLanguage,
  DebugRuleNodeEventBody
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-filter-node-switch-config',
  templateUrl: './switch-config.component.html',
  styleUrls: []
})
export class SwitchConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('tbelFuncComponent', {static: false}) tbelFuncComponent: JsFuncComponent;

  switchConfigForm: UntypedFormGroup;

  tbelEnabled = getCurrentAuthState(this.store).tbelEnabled;

  scriptLanguage = ScriptLanguage;

  changeScript: EventEmitter<void> = new EventEmitter<void>();

  readonly hasScript = true;

  readonly testScriptLabel = 'tb.rulenode.test-switch-function';

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.switchConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.switchConfigForm = this.fb.group({
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, []],
      tbelScript: [configuration ? configuration.tbelScript : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.switchConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.TBEL && !this.tbelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.switchConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.switchConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.switchConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.switchConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.switchConfigForm.get('tbelScript').setValidators(scriptLang === ScriptLanguage.TBEL ? [Validators.required] : []);
    this.switchConfigForm.get('tbelScript').updateValueAndValidity({emitEvent});
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
    const scriptLang: ScriptLanguage = this.switchConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'jsScript' : 'tbelScript';
    const helpId = scriptLang === ScriptLanguage.JS ? 'rulenode/switch_node_script_fn' : 'rulenode/tbel/switch_node_script_fn';
    const script: string = this.switchConfigForm.get(scriptField).value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'switch',
      this.translate.instant('tb.rulenode.switch'),
      'Switch',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      helpId,
      scriptLang,
      debugEventBody
    ).subscribe((theScript) => {
      if (theScript) {
        this.switchConfigForm.get(scriptField).setValue(theScript);
        this.changeScript.emit();
      }
    })
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.switchConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.JS) {
      this.jsFuncComponent.validateOnSubmit();
    }
  }
}
