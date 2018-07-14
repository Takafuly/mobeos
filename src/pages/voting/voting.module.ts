import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from '../../providers/providers';

import { VotingPage } from './voting';

@NgModule({
  declarations: [
    VotingPage,
  ],
  imports: [
    IonicPageModule.forChild(VotingPage),
    TranslateModule.forChild()
  ],
  exports: [
    VotingPage
  ]
})
export class VotingPageModule { }
