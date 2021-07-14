import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'tb-transformation-node-to-email-config',
  templateUrl: './to-email-config.component.html',
  styleUrls: []
})
export class ToEmailConfigComponent extends RuleNodeConfigurationComponent {

  toEmailConfigForm: FormGroup;
  mailBodyTypes = [
    {name: 'tb.mail-body-type.plain-text', value: 'false'},
    {name: 'tb.mail-body-type.html', value: 'true'},
    {name: 'tb.mail-body-type.dynamic', value: 'dynamic'}
  ];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
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
      isHtmlTemplate: [configuration ? configuration.isHtmlTemplate : null],
      bodyTemplate: [configuration ? configuration.bodyTemplate : null, [Validators.required]],
    });

    this.toEmailConfigForm.get('mailBodyType').valueChanges.pipe(
      startWith([configuration?.subjectTemplate])
    ).subscribe((mailBodyType) => {
      if (mailBodyType === 'dynamic') {
        this.toEmailConfigForm.get('isHtmlTemplate').patchValue('', {emitEvent: false});
        this.toEmailConfigForm.get('isHtmlTemplate').setValidators(Validators.required);
      } else {
        this.toEmailConfigForm.get('isHtmlTemplate').clearValidators();
      }
      this.toEmailConfigForm.get('isHtmlTemplate').updateValueAndValidity();
    });
  }
}
