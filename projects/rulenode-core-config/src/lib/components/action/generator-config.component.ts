import { Component, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, NodeScriptTestService } from '@core/public-api';
import {
  DebugRuleNodeEventBody,
  JsFuncComponent,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  ScriptLanguage,
  ServiceType
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-generator-config',
  templateUrl: './generator-config.component.html',
  styleUrls: []
})
export class GeneratorConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('tbelFuncComponent', {static: false}) tbelFuncComponent: JsFuncComponent;

  generatorConfigForm: UntypedFormGroup;

  tbelEnabled = getCurrentAuthState(this.store).tbelEnabled;

  scriptLanguage = ScriptLanguage;

  serviceType = ServiceType.TB_RULE_ENGINE;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.generatorConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.generatorConfigForm = this.fb.group({
      msgCount: [configuration ? configuration.msgCount : null, [Validators.required, Validators.min(0)]],
      periodInSeconds: [configuration ? configuration.periodInSeconds : null, [Validators.required, Validators.min(1)]],
      originator: [configuration ? configuration.originator : null, []],
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, []],
      tbelScript: [configuration ? configuration.tbelScript : null, []],
      queueName: [configuration ? configuration.queueName : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['scriptLang'];
  }

  protected updateValidators(emitEvent: boolean) {
    let scriptLang: ScriptLanguage = this.generatorConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.TBEL && !this.tbelEnabled) {
      scriptLang = ScriptLanguage.JS;
      this.generatorConfigForm.get('scriptLang').patchValue(scriptLang, {emitEvent: false});
      setTimeout(() => {this.generatorConfigForm.updateValueAndValidity({emitEvent: true})});
    }
    this.generatorConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.generatorConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.generatorConfigForm.get('tbelScript').setValidators(scriptLang === ScriptLanguage.TBEL ? [Validators.required] : []);
    this.generatorConfigForm.get('tbelScript').updateValueAndValidity({emitEvent});
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

  testScript(debugEventBody?: DebugRuleNodeEventBody) {
    const scriptLang: ScriptLanguage = this.generatorConfigForm.get('scriptLang').value;
    const scriptField = scriptLang === ScriptLanguage.JS ? 'jsScript' : 'tbelScript';
    const helpId = scriptLang === ScriptLanguage.JS ? 'rulenode/generator_node_script_fn' : 'rulenode/tbel/generator_node_script_fn';
    const script: string = this.generatorConfigForm.get(scriptField).value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'generate',
      this.translate.instant('tb.rulenode.generator'),
      'Generate',
      ['prevMsg', 'prevMetadata', 'prevMsgType'],
      this.ruleNodeId,
      helpId,
      scriptLang,
      debugEventBody
    ).subscribe((theScript) => {
      if (theScript) {
        this.generatorConfigForm.get(scriptField).setValue(theScript);
      }
    });
  }

  protected onValidate() {
    const scriptLang: ScriptLanguage = this.generatorConfigForm.get('scriptLang').value;
    if (scriptLang === ScriptLanguage.JS) {
      this.jsFuncComponent.validateOnSubmit();
    }
  }
}
