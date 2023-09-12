import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import {
    MessageType,
    messageTypeNames,
    RuleNodeConfiguration,
    RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'tb-action-node-device-state-config',
    templateUrl: './device-state-config.component.html',
    styleUrls: []
})
export class DeviceStateConfigComponent extends RuleNodeConfigurationComponent {

    deviceState: FormGroup;

    public messageTypeNames = messageTypeNames;
    public eventOptions: MessageType[] = [
        MessageType.CONNECT_EVENT,
        MessageType.ACTIVITY_EVENT,
        MessageType.DISCONNECT_EVENT,
        MessageType.INACTIVITY_EVENT
    ];

    constructor(protected store: Store<AppState>,
                private fb: FormBuilder) {
        super(store);
    }

    protected configForm(): FormGroup {
        return this.deviceState;
    }

    protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
        return {
            event: isDefinedAndNotNull(configuration?.event) ? configuration.event : MessageType.ACTIVITY_EVENT
        };
    }

    protected onConfigurationSet(configuration: RuleNodeConfiguration) {
        this.deviceState = this.fb.group({
            event: [configuration.event, [Validators.required]]
        });
    }

}
