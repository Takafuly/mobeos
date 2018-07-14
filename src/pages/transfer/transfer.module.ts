import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from '../../providers/providers';

import { TransferPage } from './transfer';

@NgModule({
  declarations: [
    TransferPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferPage),
    TranslateModule.forChild()
  ],
  exports: [
    TransferPage
  ]
})
export class TransferPageModule { }
