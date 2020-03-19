import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharsetTypes, charsetTypesTranslations} from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-kafka-config',
  templateUrl: './kafka-config.component.html',
  styleUrls: []
})
export class KafkaConfigComponent extends RuleNodeConfigurationComponent {

  kafkaConfigForm: FormGroup;

  charsetTypes = Object.keys(CharsetTypes);
  charsetTypesTranslationsMap = charsetTypesTranslations;

  ackValues: string[] = ['all', '-1', '0', '1'];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.kafkaConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.kafkaConfigForm = this.fb.group({
      topicPattern: [configuration ? configuration.topicPattern : null, [Validators.required]],
      bootstrapServers: [configuration ? configuration.bootstrapServers : null, [Validators.required]],
      retries: [configuration ? configuration.retries : null, [Validators.min(0)]],
      batchSize: [configuration ? configuration.batchSize : null, [Validators.min(0)]],
      linger: [configuration ? configuration.linger : null, [Validators.min(0)]],
      bufferMemory: [configuration ? configuration.bufferMemory : null, [Validators.min(0)]],
      acks: [configuration ? configuration.acks : null, [Validators.required]],
      keySerializer: [configuration ? configuration.keySerializer : null, [Validators.required]],
      valueSerializer: [configuration ? configuration.valueSerializer : null, [Validators.required]],
      otherProperties: [configuration ? configuration.otherProperties : null, []],
      addMetadataKeyValuesAsKafkaHeaders: [configuration ? configuration.addMetadataKeyValuesAsKafkaHeaders : false, []],
      kafkaHeadersCharset: [configuration && configuration.kafkaHeadersCharset ?
        configuration.kafkaHeadersCharset : CharsetTypes['UTF-8'], [Validators.required]]
    });
  }

}
