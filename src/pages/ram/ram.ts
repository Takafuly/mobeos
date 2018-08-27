import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings } from '../../providers/providers';
import { FirstRunPage } from '../pages';

import * as Eos from 'eosjs';

@IonicPage()
@Component({
  selector: 'page-ram',
  templateUrl: 'ram.html'
})
export class RamPage {
  eos: any;
  ram_usage: any;
  ram_quota: any;
  payer_acct: any;
  seller_acct: any;
  receiver_acct: any;
  ram_2sell: any;
  ram_2purchase: any;
  buyin: any = 1;
  simple: any;
  loading: any;
  accountName: any;
  mainTokenName: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, private iab: InAppBrowser, public settings: Settings) {
      
      this.mainTokenName = this.settings.getChainPKeyPrefix();

  }

  ionViewDidLoad() {
    let config = this.settings.getEosConfig();
    this.eos = Eos(config);
    this.accountName = this.settings.accountName;
    this.payer_acct = '';
    this.seller_acct = '';
    this.receiver_acct = '';
    this.ram_2sell = '';
    this.ram_2purchase = '';
    this.buyin = 1;
    this.eos['getTableRows']({
      json: true,
      code: 'eosio',
      scope: 'eosio',
      table: 'rammarket'
    }, (error, result) => { console.log(error, result) });
    this.eos['getAccount'](this.accountName, (error, result) => {
      if (error) {
        this.presentAlert(error.message);
      }
      if (result) {
        this.ram_usage = (result.ram_usage / 1024).toFixed(2);
        this.ram_quota = (result.ram_quota / 1024).toFixed(2);
      }
    });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({ content: 'Please wait...' });
    this.loading.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showConfirm(message: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

      let confirm = this.alertCtrl.create({
        title: '',
        message: message,
        buttons: [{
          text: 'CANCEL',
          handler: () => {
            reject();
          }
        }, {
          text: 'OK',
          handler: () => {
            resolve(true);
          }
        }]
      });

      confirm.present();
    });
  }

  presentConfirm(msg, id) {
    let alert = this.alertCtrl.create({
      title: 'Successful Transaction',
      message: msg,
      buttons: [
        {
          text: 'Return',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'View',
          handler: () => {
            this.iab.create(this.settings.chainConfig.chainExplorerTxnUrl + id, "_blank");
          }
        }
      ]
    });
    alert.present();
  }

  buyRAM() {
    if (this.ram_2purchase > 0 && this.payer_acct && this.receiver_acct) {
      if (this.buyin == 0)
        this.buyRAMBYTES();
      else
        this.buyRAMEOS();
    } else
      this.presentAlert("Ensure you entered an amount above 0 and defined the payer and receiver");
  }

  buyRAMEOS() {
    this.showConfirm("This will buy " + this.receiver_acct + " RAM, the equivalent of " + this.ram_2purchase + " EOS").
      then((data) => {
        this.presentLoading();
        this.eos.transaction(tr => {
          tr.buyram(
            {
              payer: this.payer_acct,
              receiver: this.receiver_acct,
              quant: (parseFloat(this.ram_2purchase)).toFixed(4) + ' EOS',
            })
        }).then((data) => {
          this.loading.dismiss();
          this.ionViewDidLoad();
          this.presentConfirm("This was a successful action, do you want to view it at eospark.com?", data.transaction_id);
        }).catch((e) => {
          this.presentAlert(e.message);
          this.loading.dismiss();
        });
      }).catch((e) => { console.log(e); });
  }


  buyRAMBYTES() {
    this.showConfirm("This will buy " + this.receiver_acct + " " + this.ram_2purchase + "Bytes of RAM").
      then((data) => {
        this.presentLoading();
        this.eos.transaction(tr => {
          tr.buyrambytes(
            {
              payer: this.payer_acct,
              receiver: this.receiver_acct,
              bytes: Number(this.ram_2purchase)
            })
        }).then((data) => {
          this.loading.dismiss();
          this.ionViewDidLoad();
          this.presentConfirm("This was a successful action, do you want to view it at eospark.com?", data.transaction_id);
        }).catch((e) => {
          this.presentAlert(e.message);
          this.loading.dismiss();
        });
      }).catch((e) => { console.log(e); });
  }

  sellRAM() {

    if (this.ram_2sell > 0 && this.ram_2sell < this.ram_quota && this.seller_acct) {
      this.showConfirm("You will sell " + this.ram_2sell + "Bytes of RAM").
        then((data) => {
          this.presentLoading();
          this.eos.transaction(tr => {
            tr.sellram({
              account: this.seller_acct,
              bytes: Number(this.ram_2sell),
            })
          }).then((data) => {
            this.loading.dismiss();
            this.ionViewDidLoad();
            this.presentConfirm("This was a successful action, do you want to view it at eospark.com?", data.transaction_id);
          }).catch((e) => {
            this.presentAlert(e.message);
            this.loading.dismiss();
          });
        }).catch((e) => { console.log(e); });
    } else
      this.presentAlert("Ensure you entered an amount above 0 and defined the seller name");
  }

  lock() {
    this.navCtrl.push(FirstRunPage);
    
    // Hide Bottom Tab bar
    this.settings.displayTab(false);
  }

}
