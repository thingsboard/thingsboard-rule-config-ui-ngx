import { Component, ViewChild } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import { JsFuncComponent, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-script-config',
  templateUrl: './script-config.component.html',
  styleUrls: []
})
export class TransformScriptConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: true}) jsFuncComponent: JsFuncComponent;

  scriptConfigForm: FormGroup;

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
      jsScript: [configuration ? configuration.jsScript : null, [Validators.required]]
    });
  }

  testScript() {
    const script: string = this.scriptConfigForm.get('jsScript').value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'update',
      this.translate.instant('tb.rulenode.transformer'),
      'Transform',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      'rulenode/transformation_node_script_fn'
    ).subscribe((theScript) => {
      if (theScript) {
        this.scriptConfigForm.get('jsScript').setValue(theScript);
      }
    });
  }

  protected onValidate() {
    this.jsFuncComponent.validateOnSubmit();
  }
}
