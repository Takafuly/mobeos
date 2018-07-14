import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { Settings } from '../../providers/providers';

import { ListMasterPage } from './list-master';

@NgModule({
  declarations: [
    ListMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(ListMasterPage),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    }),
    TranslateModule.forChild()
  ],
  exports: [
    ListMasterPage
  ]
})
export class ListMasterPageModule { }
