import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ProducerDetailPage } from './producer-detail';

@NgModule({
  declarations: [
    ProducerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProducerDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    ProducerDetailPage
  ]
})
export class ItemDetailPageModule { }
