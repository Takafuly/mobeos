import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { AccountCreatePage } from './account-create';

@NgModule({
  declarations: [
    AccountCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(AccountCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    AccountCreatePage
  ]
})
export class AccountCreatePageModule { }
