import { Component } from '@angular/core';
import { IonicPage, MenuController, ModalController, NavController, LoadingController, Platform } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FirstRunPage } from '../pages';

import * as Eos from 'eosjs';

import { TranslateService } from '@ngx-translate/core';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  slides: Slide[];
  showSkip = true;
  eos: any;
  eosConfig: any;
  accountName: any;
  acts: any = [];
  loading: any;
  order: any = true;
  dir: string = 'ltr';

  constructor(
    public navCtrl: NavController, 
    public settings: Settings, 
    public menu: MenuController, 
    public translate: TranslateService,
    public loadingCtrl: LoadingController, 
    public modalCtrl: ModalController, 
    public platform: Platform, 
    private iab: InAppBrowser) {
    this.eos = Eos(settings.getEosConfig());
    this.loadData();

  }

  refresh(_order) {
    // Confirm chain config
    this.eos = Eos(this.settings.getEosConfig());

    this.order = _order;
    this.loadData();
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({ content: 'Please wait...' });
    this.loading.present();
  }

  openItem(id) {
    this.iab.create(this.settings.chainConfig.chainExplorerTxnUrl + id, "_blank");
  }

  loadData() {
    this.presentLoading();
    this.eos['getActions']({
      account_name: this.settings.accountName,
      offset: -500,
      pos: -1
    }).then((data) => {
      console.log(data);
      if (this.order)
        this.acts = data.actions.reverse();
      else
        this.acts = data.actions;
      this.loading.dismiss();
    }).catch((e) => {
      console.log(e);
      this.loading.dismiss();
    });
  }


  lock() {
    this.navCtrl.push(FirstRunPage);
    
    // Hide Bottom Tab bar
    this.settings.displayTab(false);
  }

}
