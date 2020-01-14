import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EntitySearchDirection,
  entitySearchDirectionTranslations,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';

@Component({
  selector: 'tb-filter-node-check-relation-config',
  templateUrl: './check-relation-config.component.html',
  styleUrls: []
})
export class CheckRelationConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  checkRelationConfigForm: FormGroup;

  entitySearchDirection = Object.keys(EntitySearchDirection);
  entitySearchDirectionTranslationsMap = entitySearchDirectionTranslations;

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
    this.checkRelationConfigForm = this.fb.group({
      checkForSingleEntity: [configuration ? configuration.checkForSingleEntity : false, []],
      direction: [configuration ? configuration.direction : null, []],
      entityType: [configuration ? configuration.entityType : null,
        configuration && configuration.checkForSingleEntity ? [Validators.required] : []],
      entityId: [configuration ? configuration.entityId : null,
        configuration && configuration.checkForSingleEntity ? [Validators.required] : []],
      relationType: [configuration ? configuration.relationType : null, [Validators.required]]
    });
    this.checkRelationConfigForm.get('checkForSingleEntity').valueChanges.subscribe((checkForSingleEntity: boolean) => {
      this.checkRelationConfigForm.get('entityType').setValidators(checkForSingleEntity ? [Validators.required] : []);
      this.checkRelationConfigForm.get('entityType').updateValueAndValidity();
      this.checkRelationConfigForm.get('entityId').setValidators(checkForSingleEntity ? [Validators.required] : []);
      this.checkRelationConfigForm.get('entityId').updateValueAndValidity();
    });
    this.checkRelationConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.validateConfig()) {
        this.notifyConfigurationUpdated(this.checkRelationConfigForm.value);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private validateConfig(): boolean {
    return this.checkRelationConfigForm.valid;
  }
}
