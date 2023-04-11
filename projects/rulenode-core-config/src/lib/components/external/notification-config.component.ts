import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  EntityType,
  NotificationType,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-external-node-notification-config',
  templateUrl: './notification-config.component.html',
  styleUrls: []
})
export class NotificationConfigComponent extends RuleNodeConfigurationComponent {

  notificationConfigForm: FormGroup;
  notificationType = NotificationType;
  entityType = EntityType;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.notificationConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.notificationConfigForm = this.fb.group({
      templateId: [configuration ? configuration.templateId : null, [Validators.required]],
      targets: [configuration ? configuration.targets : [], [Validators.required]],
    });
  }
}
