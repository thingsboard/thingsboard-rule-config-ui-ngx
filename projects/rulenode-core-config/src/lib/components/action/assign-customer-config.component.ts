import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OriginatorSource, originatorSourceTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-assign-to-customer-config',
  templateUrl: './assign-customer-config.component.html',
  styleUrls: []
})
export class AssignCustomerConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  assignCustomerConfigForm: FormGroup;

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
    this.assignCustomerConfigForm = this.fb.group({
      customerNamePattern: [configuration ? configuration.customerNamePattern : null, [Validators.required]],
      createCustomerIfNotExists: [configuration ? configuration.createCustomerIfNotExists : false, []],
      customerCacheExpiration: [configuration ? configuration.customerCacheExpiration : null, [Validators.required, Validators.min(0)]]
    });
    this.assignCustomerConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.assignCustomerConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.assignCustomerConfigForm.valid;
  }
}
