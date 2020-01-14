import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OriginatorSource, originatorSourceTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-transformation-node-change-originator-config',
  templateUrl: './change-originator-config.component.html',
  styleUrls: []
})
export class ChangeOriginatorConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  originatorSource = OriginatorSource;
  originatorSources = Object.keys(OriginatorSource);
  originatorSourceTranslationMap = originatorSourceTranslations;

  changeOriginatorConfigForm: FormGroup;

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
    this.changeOriginatorConfigForm = this.fb.group({
      originatorSource: [configuration ? configuration.originatorSource : null, [Validators.required]],
      relationsQuery: [configuration ? configuration.relationsQuery : null, []]
    });
    this.updateValidators(false);
    this.changeOriginatorConfigForm.get('originatorSource').valueChanges.subscribe(() => {
      this.updateValidators(true);
    });
    this.changeOriginatorConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.changeOriginatorConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private updateValidators(emitEvent: boolean) {
    const originatorSource: OriginatorSource = this.changeOriginatorConfigForm.get('originatorSource').value;
    if (originatorSource && originatorSource === OriginatorSource.RELATED) {
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([Validators.required]);
    } else {
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([]);
    }
    this.changeOriginatorConfigForm.get('relationsQuery').updateValueAndValidity({emitEvent});
  }

  private validateConfig(): boolean {
    return this.changeOriginatorConfigForm.valid;
  }
}
