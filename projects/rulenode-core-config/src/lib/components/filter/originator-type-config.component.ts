import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { EntityType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-filter-node-originator-type-config',
  templateUrl: './originator-type-config.component.html',
  styleUrls: ['./originator-type-config.component.scss']
})
export class OriginatorTypeConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  originatorTypeConfigForm: FormGroup;

  allowedEntityTypes: EntityType[] = [
    EntityType.DEVICE,
    EntityType.ASSET,
    EntityType.ENTITY_VIEW,
    EntityType.TENANT,
    EntityType.CUSTOMER,
    EntityType.USER,
    EntityType.DASHBOARD,
    EntityType.RULE_CHAIN,
    EntityType.RULE_NODE
  ];

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
    this.originatorTypeConfigForm = this.fb.group({
      originatorTypes: [configuration ? configuration.originatorTypes : null, [Validators.required]]
    });
    this.originatorTypeConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.originatorTypeConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.originatorTypeConfigForm.valid;
  }

}
