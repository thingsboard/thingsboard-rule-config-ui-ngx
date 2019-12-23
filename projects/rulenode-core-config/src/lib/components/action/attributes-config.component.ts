import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { AttributeScope, RuleNodeConfiguration,
         RuleNodeConfigurationComponent, telemetryTypeTranslations } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-attributes-config',
  templateUrl: './attributes-config.component.html',
  styleUrls: []
})
export class AttributesConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;

  attributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.attributesConfigForm = this.fb.group({
      scope: [configuration ? configuration.scope : null, [Validators.required]]
    });
    this.attributesConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.attributesConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

}
