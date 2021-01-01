import { Component } from '@angular/core';
import { AppState, CustomerService, UserService } from '@core/public-api';
import { EntityType, PageLink, RuleNodeConfiguration, RuleNodeConfigurationComponent, User } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectAuth } from 'thingsboard/src/app/core/auth/auth.selectors';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'tb-action-node-send-firebase-notification-config',
  templateUrl: './send-firebase-notification-config.component.html',
  styleUrls: []
})
export class SendFirebaseNotificationConfigComponent extends RuleNodeConfigurationComponent {

  customerEntityType: EntityType = EntityType.CUSTOMER;

  sendFcmConfigForm: FormGroup;
  customerList: any[] = [];
  customerUserList: User[] = [];
  selectedCustomer: any = {
    name: ""
  }
  private allTenantAdminsTopic = "{tenantId}-admin";
  private allTenantUsersTopic = "{tenantId}";

  constructor(protected store: Store<AppState>,
    private fb: FormBuilder,
    private userService: UserService,
    private customerService: CustomerService) {
    super(store);
  }

  ngOnInit() {
    // this.store.pipe(onselect(selectAuth), take(1)).pipe(
    //   tap((auth) => {
    //     this.authUser = auth.userDetails;
    //     this.tenantId = this.authUser.tenantId.id;
    //   })
    // );
  }

  protected configForm(): FormGroup {
    return this.sendFcmConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.sendFcmConfigForm = this.fb.group({
      title: [configuration ? configuration.title : null, [Validators.required]],
      message: [configuration ? configuration.message : null, [Validators.required]],
      targetType: [configuration ? configuration.targetType : 'TOPIC', [Validators.required]],
      topic: [configuration ? configuration.topic : null, []],
      customerId: [configuration ? configuration.selectedCustomer : null, []],
      customerUserId: [configuration ? configuration.selectedCustomer : null, []],
      otherProperties: [configuration ? configuration.otherProperties : null, []],
      addMetadataKeyValues: [configuration ? configuration.addMetadataKeyValues : false, []],
    });

    this.sendFcmConfigForm.get("customerId").valueChanges.subscribe(customerId => {
      console.log('customerId form value changed')
      if (customerId) {
        this.sendFcmConfigForm.controls['topic'].patchValue(customerId);
        this.loadCustomerUsers(customerId);
      }
    });

    this.sendFcmConfigForm.get("customerUserId").valueChanges.subscribe(customerUserId => {
      console.log('customerUserId form value changed')
      if (customerUserId) {
        this.sendFcmConfigForm.controls['topic'].patchValue(customerUserId);
      }
    });

    this.sendFcmConfigForm.get("targetType").valueChanges.subscribe(targetType => {
      this.sendFcmConfigForm.controls['topic'].patchValue("", { emitEvent: false });

      if (targetType && targetType === 'ALL_TENANT_USERS') {
        this.sendFcmConfigForm.controls['topic'].patchValue(this.allTenantUsersTopic);
      } else if (targetType && targetType === 'ALL_TENANT_ADMIN_USERS') {
        this.sendFcmConfigForm.controls['topic'].patchValue(this.allTenantAdminsTopic);
      } else if (targetType && targetType === 'ALL_CUSTOMER_USERS') {
        this.sendFcmConfigForm.controls['customerId'].reset();
      }

      if (targetType !== 'TOPIC') {
        this.sendFcmConfigForm.controls['topic'].disable();
      } else {
        this.sendFcmConfigForm.controls['topic'].enable();
      }
    });

    setTimeout(function () {
      if (this.sendFcmConfigForm.get("targetType").value === 'SINGLE_CUSTOMER_USER') {
        if (this.sendFcmConfigForm.get("customerId").value)
          this.loadCustomerUsers(this.sendFcmConfigForm.get("customerId").value);
      }
      if (this.sendFcmConfigForm.get("targetType").value !== 'TOPIC') {
        this.sendFcmConfigForm.controls['topic'].disable();
      }
    }.bind(this), 300);
  }

  protected validatorTriggers(): string[] {
    return [];
  }

  protected updateValidators(emitEvent: boolean) {

  }

  onCustomerSelectOpened($event) {
    console.log("onCustomerSelectOpened");
    console.log($event);
  }

  private loadCustomerUsers(customerId: string) {
    this.userService.getCustomerUsers(customerId, new PageLink(1000)).subscribe((pageData) => {
      if (pageData && pageData.data)
        this.customerUserList = pageData.data;
    });
  }

}
