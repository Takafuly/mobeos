import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as Eos from 'eosjs';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'producer-detail.html'
})
export class ProducerDetailPage {
  producer: any;

  constructor(public navCtrl: NavController, navParams: NavParams,private iab: InAppBrowser) {
    this.producer = navParams.get('item');
  }

  openURL() {
    this.iab.create(this.producer.url,"_blank");
  }

}
