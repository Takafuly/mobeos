import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'transaction-detail.html'
})
export class TransactionDetailPage {
  trx: any;

  constructor(public navCtrl: NavController, navParams: NavParams,private iab: InAppBrowser) {
    this.trx = navParams.get('item');
  }

  openURL() {
    this.iab.create("https://eospark.io/MainNet"+this.trx.id,"_blank");
  }

}
