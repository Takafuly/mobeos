import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings } from '../../providers/providers';
import { FirstRunPage } from '../pages';

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
  token_contract = 'eosio.token';
  tokensList: any = [];
  loading: any;
  accountName: any;
  mainContractName: string;
  mainTokenName: string;
  token_name: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParams: NavParams,
    public alertCtrl: AlertController, private iab: InAppBrowser, public settings: Settings) {
      this.mainTokenName = this.settings.getChainTokenName();
      this.mainContractName = this.settings.getChainTokenContractName();

      //this.tokensList = this.settings.getTokensList();
      this.loading = this.loadingCtrl.create({ content: 'Please wait...' });
      let config = settings.getEosConfig();
      this.eos = Eos(config);
      this.accountName = this.settings.accountName;
      this.ionViewDidLoad();

  }

  ionViewDidLoad() {
    this.token_name = this.mainTokenName;
    this.token_contract = this.mainContractName;
    this.sender_acct = this.accountName;
    this.receiver_acct = '';
    this.amount_2send = '';
    this.memo = '';
    this.tokensList = [{symbol:this.mainTokenName,contract:this.token_contract}];
    this.tokensList = this.tokensList.concat(this.settings.getTokensList());
    if(this.navParams.get('token')){
      this.token_name = (this.navParams.get('token'));
      this.tokenChange();
    }
    this.eos['getCurrencyBalance'](this.token_contract, this.accountName, (error, result) => {
        if(result){
          if(result[0])
            this.available_balance = result[0];
        }
    });
    // this.eos['getAccount'](this.accountName, (error, result) => {
    //   if (error) {
    //     this.presentAlert(error.message);
    //   }
    //   if (result) {
    //     this.available_balance = parseFloat(result.core_liquid_balance);
    //   }
    // });
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
    if (this.token_name == 'EOS' || this.token_name == 'TLOS') {
      if (this.amount_2send > 0 && this.amount_2send <= this.available_balance) {
        if (this.sender_acct && this.receiver_acct) {
          this.showConfirm("This will transfer " + this.amount_2send + " " + this.token_name + " from " + this.sender_acct + " to " + this.receiver_acct).
            then((data) => {
              this.presentLoading();
              this.eos.transfer({ from: this.sender_acct, to: this.receiver_acct, quantity: ((parseFloat(this.amount_2send)).toFixed(4) + ' ' + this.token_name), memo: this.memo }, (error, result) => {
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
            tknContract['transfer'](this.sender_acct, this.receiver_acct, this.amount_2send + ' ' + this.token_name, this.memo, (err2, result) => {
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

  lock() {
    this.navCtrl.push(FirstRunPage);

    // Hide Bottom Tab bar
    this.settings.displayTab(false);
  }

  tokenChange(){
    if(this.token_name === this.mainTokenName){
        this.token_contract = this.mainContractName;
    } else {
        let index = this.tokensList.findIndex(tkn => tkn.symbol === this.token_name);
        this.token_contract = this.tokensList[index].contract;
    }
    this.eos['getCurrencyBalance'](this.token_contract, this.accountName, (error, result) => {
        if(result){
          if(result[0])
            this.available_balance = result[0];
          else{
              this.presentAlert('No such token contract');
              this.token_name = this.mainTokenName;
              this.tokenChange();
          }
        }
    });
  }

}
