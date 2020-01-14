import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OriginatorSource, originatorSourceTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-transformation-node-to-email-config',
  templateUrl: './to-email-config.component.html',
  styleUrls: []
})
export class ToEmailConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  toEmailConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.validateConfig()) {
        this.notifyConfigurationUpdated(null);
      }
    }, 0);
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.toEmailConfigForm = this.fb.group({
      fromTemplate: [configuration ? configuration.fromTemplate : null, [Validators.required]],
      toTemplate: [configuration ? configuration.toTemplate : null, [Validators.required]],
      ccTemplate: [configuration ? configuration.ccTemplate : null, []],
      bccTemplate: [configuration ? configuration.bccTemplate : null, []],
      subjectTemplate: [configuration ? configuration.subjectTemplate : null, [Validators.required]],
      bodyTemplate: [configuration ? configuration.bodyTemplate : null, [Validators.required]]
    });
    this.toEmailConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.toEmailConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.toEmailConfigForm.valid;
  }
}
