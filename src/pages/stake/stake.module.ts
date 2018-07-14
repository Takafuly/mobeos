import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from '../../providers/providers';

import { StakePage } from './stake';

@NgModule({
  declarations: [
    StakePage,
  ],
  imports: [
    IonicPageModule.forChild(StakePage),
    TranslateModule.forChild()
  ],
  exports: [
    StakePage
  ]
})
export class StakePageModule { }
