import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { TransactionDetailPage } from './transaction-detail';

@NgModule({
  declarations: [
    TransactionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    TransactionDetailPage
  ]
})
export class TransactionDetailPageModule { }
