import { Component, ViewChild } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import { JsFuncComponent, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-clear-alarm-config',
  templateUrl: './clear-alarm-config.component.html',
  styleUrls: []
})
export class ClearAlarmConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('jsFuncComponent', {static: true}) jsFuncComponent: JsFuncComponent;

  clearAlarmConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private nodeScriptTestService: NodeScriptTestService,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.clearAlarmConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.clearAlarmConfigForm = this.fb.group({
      alarmDetailsBuildJs: [configuration ? configuration.alarmDetailsBuildJs : null, [Validators.required]],
      alarmType: [configuration ? configuration.alarmType : null, [Validators.required]]
    });
  }

  testScript() {
    const script: string = this.clearAlarmConfigForm.get('alarmDetailsBuildJs').value;
    this.nodeScriptTestService.testNodeScript(
      script,
      'json',
      this.translate.instant('tb.rulenode.details'),
      'Details',
      ['msg', 'metadata', 'msgType'],
      this.ruleNodeId,
      'rulenode/clear_alarm_node_script_fn'
    ).subscribe((theScript) => {
      if (theScript) {
        this.clearAlarmConfigForm.get('alarmDetailsBuildJs').setValue(theScript);
      }
    });
  }

  protected onValidate() {
    this.jsFuncComponent.validateOnSubmit();
  }
}
