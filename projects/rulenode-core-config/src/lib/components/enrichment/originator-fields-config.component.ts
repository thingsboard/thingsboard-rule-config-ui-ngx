import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-enrichment-node-originator-fields-config',
  templateUrl: './originator-fields-config.component.html',
  styleUrls: []
})
export class OriginatorFieldsConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  originatorFieldsConfigForm: FormGroup;

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
    this.originatorFieldsConfigForm = this.fb.group({
      fieldsMapping: [configuration ? configuration.fieldsMapping : null, [Validators.required]]
    });
    this.originatorFieldsConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.originatorFieldsConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.originatorFieldsConfigForm.valid;
  }
}
