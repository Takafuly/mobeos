import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { TokensPage } from './tokens';

@NgModule({
  declarations: [
    TokensPage,
  ],
  imports: [
    IonicPageModule.forChild(TokensPage),
    TranslateModule.forChild()
  ],
  exports: [
    TokensPage
  ]
})
export class TokensPageModule { }
