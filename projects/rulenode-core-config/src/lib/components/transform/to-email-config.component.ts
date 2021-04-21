import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-transformation-node-to-email-config',
  templateUrl: './to-email-config.component.html',
  styleUrls: []
})
export class ToEmailConfigComponent extends RuleNodeConfigurationComponent {

  toEmailConfigForm: FormGroup;
  selectorArray;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.toEmailConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.selectorArray = [{name:'Plaim Text',value: false}, {name:'HTML','value': true}, {name:'Dynamic',value: 'dynamic'}];
    this.toEmailConfigForm = this.fb.group({
      fromTemplate: [configuration ? configuration.fromTemplate : null, [Validators.required]],
      toTemplate: [configuration ? configuration.toTemplate : null, [Validators.required]],
      ccTemplate: [configuration ? configuration.ccTemplate : null, []],
      bccTemplate: [configuration ? configuration.bccTemplate : null, []],
      subjectTemplate: [configuration ? configuration.subjectTemplate : null, [Validators.required]],
      mailBodyType: [configuration ? configuration.subjectTemplate : null],
      isHtmlTemplate: [configuration ? configuration.isHtmlTemplate : null],
      bodyTemplate: [configuration ? configuration.bodyTemplate : null, [Validators.required]],
    });

    this.toEmailConfigForm.get('mailBodyType').valueChanges.subscribe(() => {
        this.toEmailConfigForm.get('isHtmlTemplate').patchValue('',{emitEvent:false});
    });
  }
}
