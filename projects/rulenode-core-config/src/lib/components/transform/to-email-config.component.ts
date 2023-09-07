import { Component } from '@angular/core';
import { AppState, isNotEmptyStr } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'tb-transformation-node-to-email-config',
  templateUrl: './to-email-config.component.html',
  styleUrls: ['../../../../style.scss']
})
export class ToEmailConfigComponent extends RuleNodeConfigurationComponent {

  toEmailConfigForm: UntypedFormGroup;
  mailBodyTypes = [
    {name: 'tb.mail-body-type.plain-text', value: 'false'},
    {name: 'tb.mail-body-type.html', value: 'true'},
    {name: 'tb.mail-body-type.dynamic', value: 'dynamic'}
  ];

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.toEmailConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.toEmailConfigForm = this.fb.group({
      fromTemplate: [configuration ? configuration.fromTemplate : null, [Validators.required]],
      toTemplate: [configuration ? configuration.toTemplate : null, [Validators.required]],
      ccTemplate: [configuration ? configuration.ccTemplate : null, []],
      bccTemplate: [configuration ? configuration.bccTemplate : null, []],
      subjectTemplate: [configuration ? configuration.subjectTemplate : null, [Validators.required]],
      mailBodyType: [configuration ? configuration.mailBodyType : null],
      isHtmlTemplate: [configuration ? configuration.isHtmlTemplate : null, [Validators.required]],
      bodyTemplate: [configuration ? configuration.bodyTemplate : null, [Validators.required]],
    });
  }

  protected updateValidators(emitEvent: boolean) {
    if (this.toEmailConfigForm.get('mailBodyType').value === 'dynamic') {
      this.toEmailConfigForm.get('isHtmlTemplate').enable({emitEvent: false});
    } else {
      this.toEmailConfigForm.get('isHtmlTemplate').disable({emitEvent: false});
    }
    this.toEmailConfigForm.get('isHtmlTemplate').updateValueAndValidity({emitEvent})
  }

  protected validatorTriggers(): string[] {
    return ['mailBodyType'];
  }
}
