import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent, JsFuncComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-filter-node-script-config',
  templateUrl: './script-config.component.html',
  styleUrls: []
})
export class ScriptConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  @ViewChild('jsFuncComponent', {static: true}) jsFuncComponent: JsFuncComponent;

  scriptConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.scriptConfigForm = this.fb.group({
      jsScript: [configuration ? configuration.jsScript : null, [Validators.required]]
    });
    this.scriptConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.scriptConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  testScript() {
    const script: string = this.scriptConfigForm.get('jsScript').value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'filter',
      this.translate.instant('tb.rulenode.filter'),
      'Filter',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId
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
