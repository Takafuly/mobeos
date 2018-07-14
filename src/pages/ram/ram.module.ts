import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from '../../providers/providers';

import { RamPage } from './ram';

@NgModule({
  declarations: [
    RamPage,
  ],
  imports: [
    IonicPageModule.forChild(RamPage),
    TranslateModule.forChild()
  ],
  exports: [
    RamPage
  ]
})
export class RamPageModule { }
