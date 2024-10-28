import { Component, EventEmitter, ViewChild } from '@angular/core';
import { AppState, getCurrentAuthState, isDefinedAndNotNull, NodeScriptTestService } from '@core/public-api';
import {
  AliasEntityType,
  DebugRuleNodeEventBody,
  EntityType,
  JsFuncComponent,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  ScriptLanguage
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-generator-config',
  templateUrl: './generator-config.component.html',
  styleUrls: ['generator-config.component.scss']
})
export class GeneratorConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: false}) jsFuncComponent: JsFuncComponent;
  @ViewChild('tbelFuncComponent', {static: false}) tbelFuncComponent: JsFuncComponent;

  generatorConfigForm: UntypedFormGroup;

  tbelEnabled = getCurrentAuthState(this.store).tbelEnabled;

  scriptLanguage = ScriptLanguage;

  changeScript: EventEmitter<void> = new EventEmitter<void>();

  allowedEntityTypes = [
    EntityType.DEVICE, EntityType.ASSET, EntityType.ENTITY_VIEW, EntityType.CUSTOMER,
    EntityType.USER, EntityType.DASHBOARD
  ];

  additionEntityTypes = {
    TENANT: this.translate.instant('tb.rulenode.current-tenant'),
    RULE_NODE: this.translate.instant('tb.rulenode.current-rule-node')
  };

  readonly hasScript = true;

  readonly testScriptLabel = 'tb.rulenode.test-generator-function';

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
      originator: [configuration ? configuration.originator : {id: null, entityType: EntityType.RULE_NODE}, []],
      scriptLang: [configuration ? configuration.scriptLang : ScriptLanguage.JS, [Validators.required]],
      jsScript: [configuration ? configuration.jsScript : null, []],
      tbelScript: [configuration ? configuration.tbelScript : null, []]
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
      setTimeout(() => {this.generatorConfigForm.updateValueAndValidity({emitEvent: true});});
    }
    this.generatorConfigForm.get('jsScript').setValidators(scriptLang === ScriptLanguage.JS ? [Validators.required] : []);
    this.generatorConfigForm.get('jsScript').updateValueAndValidity({emitEvent});
    this.generatorConfigForm.get('tbelScript').setValidators(scriptLang === ScriptLanguage.TBEL ? [Validators.required] : []);
    this.generatorConfigForm.get('tbelScript').updateValueAndValidity({emitEvent});
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      msgCount: isDefinedAndNotNull(configuration?.msgCount) ? configuration?.msgCount : 0,
      periodInSeconds: isDefinedAndNotNull(configuration?.periodInSeconds) ? configuration?.periodInSeconds : 1,
      originator: {
        id: isDefinedAndNotNull(configuration?.originatorId) ? configuration?.originatorId : null,
        entityType: isDefinedAndNotNull(configuration?.originatorType) ? configuration?.originatorType :  EntityType.RULE_NODE
      },
      scriptLang: isDefinedAndNotNull(configuration?.scriptLang) ? configuration?.scriptLang : ScriptLanguage.JS,
      tbelScript: isDefinedAndNotNull(configuration?.tbelScript) ? configuration?.tbelScript : null,
      jsScript: isDefinedAndNotNull(configuration?.jsScript) ? configuration?.jsScript : null,
    };
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
        this.changeScript.emit();
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
