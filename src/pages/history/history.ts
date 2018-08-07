import { Component } from '@angular/core';
import { IonicPage, MenuController, ModalController,NavController, LoadingController, Platform } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
  accountname: any;
  acts:any = [];
  loading: any;
  order: any = true;
  dir: string = 'ltr';

  constructor(public navCtrl: NavController, public settings: Settings, public menu: MenuController, translate: TranslateService,
              public loadingCtrl: LoadingController, public modalCtrl: ModalController, public platform: Platform, private iab: InAppBrowser) {
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountname = this.settings.accountname;
    this.loadData();

  }

  refresh(_order) {
    this.order = _order;
    this.loadData();
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({ content: 'Please wait...'});
    this.loading.present();
  }

  openItem(id) {
    this.iab.create("https://eospark.com/MainNet/tx/"+id,"_blank");
  }

  loadData() {
    this.presentLoading();
    this.eos['getActions']({
      account_name: this.accountname,
      offset: -500,
      pos: -1
    }).then((data) => {
      console.log(data);
      if(this.order)
        this.acts = data.actions.reverse();
      else
        this.acts = data.actions;
      this.loading.dismiss();
    }).catch((e) => {
      console.log(e);
      this.loading.dismiss();
    });
  }


  ionViewDidEnter() {

  }


}
