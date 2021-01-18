import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder, FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors, Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { isDefinedAndNotNull } from '@core/public-api';
import { PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { credentialsType, credentialsTypes, credentialsTypeTranslations } from '../../rulenode-core-config.models';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

interface CredentialsConfig {
  type: credentialsType;
  username?: string;
  password?: string;
  caCert?: string;
  caCertFileName?: string;
  privateKey?: string;
  privateKeyFileName?: string;
  cert?: string;
  certFileName?: string;
}

@Component({
  selector: 'tb-credentials-config',
  templateUrl: './credentials-config.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CredentialsConfigComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CredentialsConfigComponent),
      multi: true,
    }
  ]
})
export class CredentialsConfigComponent extends PageComponent implements ControlValueAccessor, OnInit, Validator, OnDestroy {

  credentialsConfigFormGroup: FormGroup;

  subscriptions: Subscription[] = [];

  private requiredValue: boolean;
  get required(): boolean {
    return this.requiredValue;
  }
  @Input()
  set required(value: boolean) {
    this.requiredValue = coerceBooleanProperty(value);
  }

  allCredentialsTypes = credentialsTypes;
  credentialsTypeTranslationsMap = credentialsTypeTranslations;

  private propagateChange = null;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.credentialsConfigFormGroup = this.fb.group(
      {
        type: [null, [Validators.required]],
        username: [null, []],
        password: [null, []],
        caCert: [null, []],
        caCertFileName: [null, []],
        privateKey: [null, []],
        privateKeyFileName: [null, []],
        cert: [null, []],
        certFileName: [null, []]
      }
    );
    this.subscriptions.push(
      this.credentialsConfigFormGroup.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
        this.updateView();
      })
    );
    this.subscriptions.push(
      this.credentialsConfigFormGroup.get('type').valueChanges.subscribe(() => {
        this.credentialsTypeChanged();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  writeValue(credentials: CredentialsConfig | null): void {
    if (isDefinedAndNotNull(credentials)) {
      this.credentialsConfigFormGroup.reset(credentials, {emitEvent: false});
      this.updateValidators(false);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.credentialsConfigFormGroup.disable();
    } else {
      this.credentialsConfigFormGroup.enable();
      this.updateValidators();
    }
  }

  updateView() {
    let credentialsConfigValue = this.credentialsConfigFormGroup.value;
    const credentialsType: credentialsType = credentialsConfigValue.type;
    switch (credentialsType) {
      case 'anonymous':
        credentialsConfigValue = {
          type: credentialsType
        };
        break;
      case 'basic':
        credentialsConfigValue = {
          type: credentialsType,
          username: credentialsConfigValue.username,
          password: credentialsConfigValue.password,
        };
        break;
      case 'cert.PEM':
        delete credentialsConfigValue.username;
        break;
    }
    this.propagateChange(credentialsConfigValue);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  public validate(c: FormControl) {
    return this.credentialsConfigFormGroup.valid ? null : {
      credentialsConfig: {
        valid: false,
      },
    };
  }

  credentialsTypeChanged(): void {
    this.credentialsConfigFormGroup.patchValue({
      username: null,
      password: null,
      caCert: null,
      caCertFileName: null,
      privateKey: null,
      privateKeyFileName: null,
      cert: null,
      certFileName: null,
    });
    this.updateValidators();
  }

  protected updateValidators(emitEvent: boolean = false) {
    const credentialsType: credentialsType = this.credentialsConfigFormGroup.get('type').value;
    if (emitEvent) {
      this.credentialsConfigFormGroup.reset({ type: credentialsType }, {emitEvent: false});
    }
    this.credentialsConfigFormGroup.setValidators([]);
    this.credentialsConfigFormGroup.get('username').setValidators([]);
    this.credentialsConfigFormGroup.get('password').setValidators([]);
    switch (credentialsType) {
      case 'anonymous':
        break;
      case 'basic':
        this.credentialsConfigFormGroup.get('username').setValidators([Validators.required]);
        this.credentialsConfigFormGroup.get('password').setValidators([Validators.required]);
        break;
      case 'cert.PEM':
        this.credentialsConfigFormGroup.setValidators([this.requiredFilesSelected(
          Validators.required,
          [['caCert', 'caCertFileName'], ['privateKey', 'privateKeyFileName', 'cert', 'certFileName']]
        )]);
        break;
    }
    this.credentialsConfigFormGroup.get('username').updateValueAndValidity({emitEvent});
    this.credentialsConfigFormGroup.get('password').updateValueAndValidity({emitEvent});
    this.credentialsConfigFormGroup.updateValueAndValidity({emitEvent});
  }

  private requiredFilesSelected(validator: ValidatorFn,
                                requiredFieldsSet: string[][] = null) {
    return (group: FormGroup): ValidationErrors | null => {
      if (!requiredFieldsSet) {
        requiredFieldsSet = [Object.keys(group.controls)];
      }
      const allRequiredFilesSelected = group?.controls &&
        requiredFieldsSet.some(arrFields => arrFields.every(k => !validator(group.controls[k])));

      return allRequiredFilesSelected ? null : {notAllRequiredFilesSelected: true};
    }
  }
}
