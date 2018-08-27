import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { FirstRunPage } from '../pages';

import * as Eos from 'eosjs';

@IonicPage()
@Component({
  selector: 'page-stake',
  templateUrl: 'stake.html'
})
export class StakePage {
  eos: any;
  available_balance: any;
  staked_cpu: any;
  staked_net: any;
  total_staked: any;
  net_staking_value: any;
  cpu_staking_value: any;
  staking_percentage: any;
  cpu_unstaking_value: any;
  net_unstaking_value: any;
  unstaking_percentage: any;
  currentItems: any = [];
  loading: any;
  accountName: any;
  translationItems: any;
  mainTokenName: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private iab: InAppBrowser,
    public settings: Settings,
    public translate: TranslateService
  ) {

    this.translationItems = {
      'PLEASE_WAIT':'', 
      'ENTER_ABOVE_ZERO':'',
      'ENTER_BELOW_STAKE':'',
      'ENTER_BELOW_BALANCE':'',
      'SUCCESSFUL_STAKING':'',
      'SUCCESSFUL_UNSTAKING':'',
      'SUCCESSFUL_TXN':'',
      'ERROR':'',
      'SPECIFY_STAKE_AMOUNT':'',
      'SPECIFY_UNSTAKE_AMOUNT':''
    };

    // Translation variable initialization
    translate.get('PLEASE_WAIT').subscribe(value => {this.translationItems['PLEASE_WAIT'] = value;});
    translate.get('ENTER_ABOVE_ZERO').subscribe(value => {this.translationItems['ENTER_ABOVE_ZERO'] = value;});
    translate.get('ENTER_BELOW_STAKE').subscribe(value => {this.translationItems['ENTER_BELOW_STAKE'] = value;});
    translate.get('ENTER_BELOW_BALANCE').subscribe(value => {this.translationItems['ENTER_BELOW_BALANCE'] = value;});
    translate.get('SUCCESSFUL_STAKING').subscribe(value => {this.translationItems['SUCCESSFUL_STAKING'] = value;});
    translate.get('SUCCESSFUL_UNSTAKING').subscribe(value => {this.translationItems['SUCCESSFUL_UNSTAKING'] = value;});
    translate.get('SUCCESSFUL_TXN').subscribe(value => {this.translationItems['SUCCESSFUL_TXN'] = value;});
    translate.get('ERROR').subscribe(value => {this.translationItems['ERROR'] = value;});
    translate.get('SPECIFY_STAKE_AMOUNT').subscribe(value => {this.translationItems['SPECIFY_STAKE_AMOUNT'] = value;});
    translate.get('SPECIFY_UNSTAKE_AMOUNT').subscribe(value => {this.translationItems['SPECIFY_UNSTAKE_AMOUNT'] = value;});

    this.mainTokenName = this.settings.getChainPKeyPrefix();
    this.loading = this.loadingCtrl.create({ content: this.translationItems['PLEASE_WAIT'] });
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountName = this.settings.accountName;
    this.ionViewDidLoad();
    translate.setDefaultLang('en');
  }

  ionViewDidLoad() {
    this.eos['getAccount'](this.accountName, (error, result) => {
      if (error) {
        this.presentAlert(error.message);
      }
      if (result) {
        console.log(result);

        this.available_balance = parseFloat(result.core_liquid_balance);
        this.staked_cpu = parseFloat(result.total_resources.cpu_weight);
        this.staked_net = parseFloat(result.total_resources.net_weight);
        this.total_staked = parseFloat(result.total_resources.net_weight) + parseFloat(result.total_resources.cpu_weight);
        this.net_staking_value = this.available_balance / 4;
        this.cpu_staking_value = this.available_balance / 4;
        this.net_unstaking_value = 0;
        this.cpu_unstaking_value = 0;
        this.staking_percentage = 50;
      }
    });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({ content: this.translationItems['PLEASE_WAIT'] });
    this.loading.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: this.translationItems['ERROR'],
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
      title: this.translationItems['SUCCESSFUL_TXN'],
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

  unstakerangeChanged($event) {
    this.cpu_unstaking_value = ((this.staked_cpu) * this.unstaking_percentage / 100).toFixed(4);
    this.net_unstaking_value = ((this.staked_net) * this.unstaking_percentage / 100).toFixed(4);
    console.log(this.cpu_unstaking_value);
  }

  cpuunstakevalueChanged($event) {
    console.log(this.total_staked);
    if (this.cpu_unstaking_value < 0) {
      this.presentAlert(this.translationItems['ENTER_ABOVE_ZERO']);
      this.cpu_unstaking_value = 0;
      this.unstaking_percentage = this.net_unstaking_value / this.total_staked * 100;
    }
    else {
      if (this.cpu_unstaking_value > (this.total_staked - this.net_unstaking_value)) {
        this.presentAlert(this.translationItems['ENTER_BELOW_STAKE']);
        this.cpu_unstaking_value = (this.total_staked - this.net_unstaking_value);
        this.unstaking_percentage = 100;
      }
      else
        this.unstaking_percentage = (parseFloat(this.net_unstaking_value) + parseFloat(this.cpu_unstaking_value)) / (this.total_staked) * 100;
    }
  }

  netunstakevalueChanged($event) {
    console.log(this.total_staked);
    if (this.net_unstaking_value < 0) {
      this.presentAlert(this.translationItems['ENTER_ABOVE_ZERO']);
      this.net_unstaking_value = 0;
      this.unstaking_percentage = this.cpu_unstaking_value / this.total_staked * 100;
    }
    else {
      if (this.net_unstaking_value > (this.total_staked - this.cpu_unstaking_value)) {
        this.presentAlert(this.translationItems['ENTER_BELOW_STAKE']);
        this.net_unstaking_value = (this.total_staked - this.cpu_unstaking_value);
        this.unstaking_percentage = 100;
      }
      else
        this.unstaking_percentage = (parseFloat(this.net_unstaking_value) + parseFloat(this.cpu_unstaking_value)) / (this.total_staked) * 100;
    }
  }

  stakerangeChanged($event) {
    this.net_staking_value = (this.available_balance * this.staking_percentage / 100 / 2).toFixed(4);
    this.cpu_staking_value = (this.available_balance * this.staking_percentage / 100 / 2).toFixed(4);
  }

  netstakevalueChanged($event) {
    if (this.net_staking_value < 0) {
      this.presentAlert(this.translationItems['ENTER_ABOVE_ZERO']);
      this.net_staking_value = 0;
      this.staking_percentage = this.cpu_staking_value / this.available_balance * 100;
    }
    else {
      if (this.net_staking_value > (this.available_balance - this.cpu_staking_value)) {
        this.presentAlert(this.translationItems['ENTER_BELOW_BALANCE']);
        this.net_staking_value = this.available_balance - this.cpu_staking_value;
        this.staking_percentage = 100;
      }
      else
        this.staking_percentage = (parseFloat(this.net_staking_value) + parseFloat(this.cpu_staking_value)) / this.available_balance * 100;
    }
  }

  cpustakevalueChanged($event) {
    if (this.cpu_staking_value < 0) {
      this.presentAlert(this.translationItems['ENTER_ABOVE_ZERO']);
      this.cpu_staking_value = 0;
      this.staking_percentage = this.net_staking_value / this.available_balance * 100;
    }
    else {
      if (this.cpu_staking_value > (this.available_balance - this.net_staking_value)) {
        this.presentAlert(this.translationItems['ENTER_BELOW_BALANCE']);
        this.cpu_staking_value = this.available_balance - this.net_staking_value;
        this.staking_percentage = 100;
      }
      else
        this.staking_percentage = (parseFloat(this.net_staking_value) + parseFloat(this.cpu_staking_value)) / this.available_balance * 100;
    }
  }

  onStake() {
    if (this.net_staking_value > 0 || this.cpu_staking_value > 0) {
      this.showConfirm("This will stake " + this.cpu_staking_value + " EOS for CPU and " + this.net_staking_value + " EOS for Network").
        then((data) => {
          this.presentLoading();
          this.eos.transaction(tr => {
            tr.delegatebw({
              from: this.accountName,
              receiver: this.accountName,
              stake_net_quantity: (parseFloat(this.net_staking_value)).toFixed(4) + ' EOS',
              stake_cpu_quantity: (parseFloat(this.cpu_staking_value)).toFixed(4) + ' EOS',
              transfer: 0
            })
          }).then((data) => {
            this.loading.dismiss();
            this.ionViewDidLoad();
            this.presentConfirm(this.translationItems['SUCCESSFUL_STAKING'], data.transaction_id);
          }).catch((e) => {
            this.loading.dismiss();
            this.presentAlert(e.message);
          });
        }).catch((e) => { console.log(e); });
    } else
      this.presentAlert(this.translationItems['SPECIFY_STAKE_AMOUNT']);
  }

  onUnstake() {
    if (this.cpu_unstaking_value > 0 || this.net_unstaking_value > 0) {
      this.showConfirm("This will unstake " + this.cpu_unstaking_value + " EOS from CPU and " + this.net_unstaking_value + " EOS from Network").
        then((data) => {
          this.presentLoading();
          this.eos.transaction(tr => {
            tr.undelegatebw({
              from: this.accountName,
              receiver: this.accountName,
              unstake_net_quantity: (parseFloat(this.net_unstaking_value)).toFixed(4) + ' EOS',
              unstake_cpu_quantity: (parseFloat(this.cpu_unstaking_value)).toFixed(4) + ' EOS'
            })
          }).then((data) => {
            this.loading.dismiss();
            this.ionViewDidLoad();
            this.presentConfirm(this.translationItems['SUCCESSFUL_UNSTAKING'], data.transaction_id);
          }).catch((e) => {
            this.loading.dismiss();
            this.presentAlert(e.message);
          });
        }).catch((e) => { console.log(e); });
    } else
      this.presentAlert(this.translationItems['SPECIFY_UNSTAKE_AMOUNT']);
  }

  lock() {
      this.navCtrl.push(FirstRunPage);
      
      // Hide Bottom Tab bar
      this.settings.displayTab(false);
  }

}
