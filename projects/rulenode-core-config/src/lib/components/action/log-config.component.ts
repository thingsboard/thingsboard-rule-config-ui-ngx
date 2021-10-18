import { Component, ViewChild } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import { JsFuncComponent, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-log-config',
  templateUrl: './log-config.component.html',
  styleUrls: []
})
export class LogConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: true}) jsFuncComponent: JsFuncComponent;

  logConfigForm: FormGroup;

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
      jsScript: [configuration ? configuration.jsScript : null, [Validators.required]]
    });
  }

  testScript() {
    const script: string = this.logConfigForm.get('jsScript').value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'string',
      this.translate.instant('tb.rulenode.to-string'),
      'ToString',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      'rulenode/log_node_script_fn'
    ).subscribe((theScript) => {
      if (theScript) {
        this.logConfigForm.get('jsScript').setValue(theScript);
      }
    });
  }

  protected onValidate() {
    this.jsFuncComponent.validateOnSubmit();
  }
}
