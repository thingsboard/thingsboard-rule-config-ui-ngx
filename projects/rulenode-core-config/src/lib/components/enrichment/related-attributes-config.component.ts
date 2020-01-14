import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-enrichment-node-related-attributes-config',
  templateUrl: './related-attributes-config.component.html',
  styleUrls: []
})
export class RelatedAttributesConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  relatedAttributesConfigForm: FormGroup;

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
    this.relatedAttributesConfigForm = this.fb.group({
      relationsQuery: [configuration ? configuration.relationsQuery : false, [Validators.required]],
      telemetry: [configuration ? configuration.telemetry : false, []],
      attrMapping: [configuration ? configuration.attrMapping : null, [Validators.required]]
    });
    this.relatedAttributesConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.relatedAttributesConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.relatedAttributesConfigForm.valid;
  }
}
