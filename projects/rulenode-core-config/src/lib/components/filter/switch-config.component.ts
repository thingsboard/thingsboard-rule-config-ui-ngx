import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent, JsFuncComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-filter-node-switch-config',
  templateUrl: './switch-config.component.html',
  styleUrls: []
})
export class SwitchConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: true}) jsFuncComponent: JsFuncComponent;

  switchConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.switchConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.switchConfigForm = this.fb.group({
      jsScript: [configuration ? configuration.jsScript : null, [Validators.required]]
    });
  }

  testScript() {
    const script: string = this.switchConfigForm.get('jsScript').value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'switch',
      this.translate.instant('tb.rulenode.switch'),
      'Switch',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      'rulenode/switch_node_script_fn'
    ).subscribe((theScript) => {
      if (theScript) {
        this.switchConfigForm.get('jsScript').setValue(theScript);
      }
    });
  }

  protected onValidate() {
    this.jsFuncComponent.validateOnSubmit();
  }
}
