import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tokens',
  templateUrl: 'tokens.html'
})
export class TokensPage {
  @ViewChild('fileInput') fileInput;

  listTokens: any = [];

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
      this.listTokens = navParams.get('tokens');
  }

  ionViewDidLoad() {
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  sendToken(_token) {
    this.navCtrl.push('TransferPage',{token: (_token.bal.split(' '))[1]});
  }

}
