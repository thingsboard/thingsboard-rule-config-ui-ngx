import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tb-node-empty-config',
  template: '<div></div>',
  styleUrls: []
})
export class EmptyConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  constructor(protected store: Store<AppState>) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {}

}
