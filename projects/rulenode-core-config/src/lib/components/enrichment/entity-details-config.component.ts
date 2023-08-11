import { Component, OnInit } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityDetailsField, entityDetailsTranslations, FetchTo } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-enrichment-node-entity-details-config',
  templateUrl: './entity-details-config.component.html',
  styleUrls: ['../../../../style.scss']
})

export class EntityDetailsConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  entityDetailsConfigForm: FormGroup;

  public predefinedValues = [];

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {
    super(store);
    for (const field of Object.keys(EntityDetailsField)) {
      this.predefinedValues.push({
        value: EntityDetailsField[field],
        name: this.translate.instant(entityDetailsTranslations.get(EntityDetailsField[field]))
      });
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected configForm(): FormGroup {
    return this.entityDetailsConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    let fetchTo;
    if (isDefinedAndNotNull(configuration?.addToMetadata)) {
      if (configuration.addToMetadata) {
        fetchTo = FetchTo.METADATA;
      } else {
        fetchTo = FetchTo.DATA;
      }
    } else {
      if (configuration?.fetchTo) {
        fetchTo = configuration.fetchTo;
      } else {
        fetchTo = FetchTo.DATA;
      }
    }

    return {
      detailsList: isDefinedAndNotNull(configuration?.detailsList) ? configuration.detailsList : null,
      fetchTo
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.entityDetailsConfigForm = this.fb.group({
      detailsList: [configuration.detailsList, [Validators.required]],
      fetchTo:  [configuration.fetchTo, []]
    });
  }
}
