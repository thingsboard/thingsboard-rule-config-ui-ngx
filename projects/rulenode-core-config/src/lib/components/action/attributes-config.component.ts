import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { AttributeScope, RuleNodeConfiguration, RuleNodeConfigurationComponent, telemetryTypeTranslations } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-attributes-config',
  templateUrl: './attributes-config.component.html',
  styleUrls: []
})
export class AttributesConfigComponent extends RuleNodeConfigurationComponent {

  attributeScopeMap = AttributeScope;
  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;

  attributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.attributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.attributesConfigForm = this.fb.group({
      scope: [configuration ? configuration.scope : null, [Validators.required]],
      notifyDevice: [configuration ? configuration.notifyDevice : true, []],
      sendAttributesUpdatedNotification: [configuration ? configuration.sendAttributesUpdatedNotification : false, []]
    });
    this.attributesConfigForm.get('scope').valueChanges.subscribe((value) => {
      if (value === 'CLIENT_SCOPE') {
        this.attributesConfigForm.get('sendAttributesUpdatedNotification').patchValue(false, {emitEvent: false});
      }
    });
  }

}
