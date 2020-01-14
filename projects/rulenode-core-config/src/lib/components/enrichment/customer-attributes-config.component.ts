import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-enrichment-node-customer-attributes-config',
  templateUrl: './customer-attributes-config.component.html',
  styleUrls: []
})
export class CustomerAttributesConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  customerAttributesConfigForm: FormGroup;

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
    this.customerAttributesConfigForm = this.fb.group({
      telemetry: [configuration ? configuration.telemetry : false, []],
      attrMapping: [configuration ? configuration.attrMapping : null, [Validators.required]]
    });
    this.customerAttributesConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.customerAttributesConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.customerAttributesConfigForm.valid;
  }
}
