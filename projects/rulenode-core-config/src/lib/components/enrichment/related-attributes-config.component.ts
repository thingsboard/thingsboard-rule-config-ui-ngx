import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-enrichment-node-related-attributes-config',
  templateUrl: './related-attributes-config.component.html',
  styleUrls: []
})
export class RelatedAttributesConfigComponent extends RuleNodeConfigurationComponent {

  relatedAttributesConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.relatedAttributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.relatedAttributesConfigForm = this.fb.group({
      relationsQuery: [configuration ? configuration.relationsQuery : null, [Validators.required]],
      telemetry: [configuration ? configuration.telemetry : false, []],
      attrMapping: [configuration ? configuration.attrMapping : null, [Validators.required]],
      fetchTo: [configuration ? configuration.fetchTo : null]
    });
  }
}
