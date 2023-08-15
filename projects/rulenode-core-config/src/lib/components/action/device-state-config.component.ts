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
    styleUrls: ['./device-state-config.component.scss']
})
export class DeviceStateConfigComponent extends RuleNodeConfigurationComponent {

    deviceState: FormGroup;

    public eventOptions = [
        {
            value: MessageType.CONNECT_EVENT,
            name: messageTypeNames.get(MessageType.CONNECT_EVENT)
        },
        {
            value: MessageType.ACTIVITY_EVENT,
            name: messageTypeNames.get(MessageType.ACTIVITY_EVENT)
        },
        {
            value: MessageType.DISCONNECT_EVENT,
            name: messageTypeNames.get(MessageType.DISCONNECT_EVENT)
        },
        {
            value: MessageType.INACTIVITY_EVENT,
            name: messageTypeNames.get(MessageType.INACTIVITY_EVENT)
        }
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
