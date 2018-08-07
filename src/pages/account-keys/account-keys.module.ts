import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { AccountKeysPage } from './account-keys';

@NgModule({
  declarations: [
    AccountKeysPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountKeysPage),
    TranslateModule.forChild()
  ],
  exports: [
    AccountKeysPage
  ]
})
export class AccountKeysPageModule { }
