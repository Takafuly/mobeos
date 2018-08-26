import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings } from '../../providers/providers';

import * as Eos from 'eosjs';

@IonicPage()
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage {
  eos: any;
  available_balance: any;
  sender_acct: any = '';
  receiver_acct: any = '';
  amount_2send: any = '';
  memo: any = '';
  tokenname: any = 'EOS';
  token_contract = 'eosio.token'
  loading: any;
  accountName: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, private iab: InAppBrowser, public settings: Settings) {
    this.loading = this.loadingCtrl.create({ content: 'Please wait...' });
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountName = this.settings.accountName;
    this.ionViewDidLoad();

  }

  ionViewDidLoad() {
    this.sender_acct = this.accountName;
    this.receiver_acct = '';
    this.amount_2send = '';
    this.memo = '';
    this.tokenname = 'EOS';
    this.token_contract = 'eosio.token';
    this.eos['getAccount'](this.accountName, (error, result) => {
      if (error) {
        this.presentAlert(error.message);
      }
      if (result) {
        this.available_balance = parseFloat(result.core_liquid_balance);
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

  send() {
    if (this.tokenname == 'EOS') {
      if (this.amount_2send > 0 && this.amount_2send <= this.available_balance) {
        if (this.sender_acct && this.receiver_acct) {
          this.showConfirm("This will transfer " + this.amount_2send + " " + this.tokenname + " from " + this.sender_acct + " to " + this.receiver_acct).
            then((data) => {
              this.presentLoading();
              this.eos.transfer({ from: this.sender_acct, to: this.receiver_acct, quantity: ((parseFloat(this.amount_2send)).toFixed(4) + ' ' + this.tokenname), memo: this.memo }, (error, result) => {
                if (result) {
                  this.loading.dismiss();
                  this.ionViewDidLoad();
                  this.presentConfirm("This was a Successful transfer, do you want to view details at eospark.com?", result.transaction_id);
                } else {
                  this.loading.dismiss();
                  this.ionViewDidLoad();
                  this.presentAlert(error.message);
                }
              });
            }).catch((e) => { console.log(e); });
        } else
          this.presentAlert("Please specify both Sender and Receiver");
      } else
        this.presentAlert("Amount to to be sent has to be between 0 and the maximum amount of the available balance");
    } else {
      this.eos.contract(this.token_contract, (err, tknContract) => {
        if (!err) {
          if (tknContract['transfer']) {
            tknContract['transfer'](this.sender_acct, this.receiver_acct, this.amount_2send + ' ' + this.tokenname, this.memo, (err2, result) => {
              if (err2) {
                this.presentAlert((err2.message));
              } else {
                this.presentAlert(result);
              }
            });
          } else {
            this.presentAlert('No such token contract');
          }
        } else {
          this.presentAlert(err.message);
        }
      });
    }
  }

}
