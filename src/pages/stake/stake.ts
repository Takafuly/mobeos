import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings } from '../../providers/providers';

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
  accountname: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, private iab: InAppBrowser, public settings: Settings) {
    this.loading = this.loadingCtrl.create({ content: 'Please wait...'});
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountname = this.settings.accountname;
    this.ionViewDidLoad();

  }

  ionViewDidLoad() {
    this.eos['getAccount'](this.accountname, (error, result) => {
      if(error){
        this.presentAlert(error.message);
      }
      if(result){
        console.log(result);

        this.available_balance = parseFloat(result.core_liquid_balance);
        this.staked_cpu = parseFloat(result.total_resources.cpu_weight);
        this.staked_net = parseFloat(result.total_resources.net_weight);
        this.total_staked = parseFloat(result.total_resources.net_weight)+parseFloat(result.total_resources.cpu_weight);
        this.net_staking_value = this.available_balance/4;
        this.cpu_staking_value = this.available_balance/4;
        this.net_unstaking_value = 0;
        this.cpu_unstaking_value = 0;
        this.staking_percentage = 50;
      }
    });
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({ content: 'Please wait...'});
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


  presentConfirm(msg,id) {
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
            this.iab.create("https://eospark.com/MainNet/tx/"+id,"_blank");
          }
        }
      ]
    });
    alert.present();
  }

   unstakerangeChanged($event){
     this.cpu_unstaking_value = ((this.staked_cpu) * this.unstaking_percentage / 100).toFixed(4);
     this.net_unstaking_value = ((this.staked_net) * this.unstaking_percentage / 100).toFixed(4);
     console.log(this.cpu_unstaking_value);
   }

   cpuunstakevalueChanged($event){
     console.log(this.total_staked);
     if(this.cpu_unstaking_value < 0 ){
       this.presentAlert("Enter an amount above 0");
       this.cpu_unstaking_value = 0;
       this.unstaking_percentage = this.net_unstaking_value/this.total_staked * 100;
     }
     else{
       if(this.cpu_unstaking_value > (this.total_staked - this.net_unstaking_value)){
        this.presentAlert("Enter an amount less than the total staked balance");
        this.cpu_unstaking_value = (this.total_staked - this.net_unstaking_value);
        this.unstaking_percentage = 100;
      }
      else
        this.unstaking_percentage = (parseFloat(this.net_unstaking_value) + parseFloat(this.cpu_unstaking_value)) / (this.total_staked) * 100;
    }
   }

   netunstakevalueChanged($event){
     console.log(this.total_staked);
     if(this.net_unstaking_value < 0 ){
       this.presentAlert("Enter an amount above 0");
       this.net_unstaking_value = 0;
       this.unstaking_percentage = this.cpu_unstaking_value/this.total_staked * 100;
     }
     else{
       if(this.net_unstaking_value > (this.total_staked - this.cpu_unstaking_value)){
        this.presentAlert("Enter an amount less than the total staked balance");
        this.net_unstaking_value = (this.total_staked - this.cpu_unstaking_value);
        this.unstaking_percentage = 100;
      }
      else
        this.unstaking_percentage = (parseFloat(this.net_unstaking_value) + parseFloat(this.cpu_unstaking_value)) / (this.total_staked) * 100;
    }
   }

   stakerangeChanged($event){
     this.net_staking_value = (this.available_balance * this.staking_percentage / 100 /2).toFixed(4);
     this.cpu_staking_value = (this.available_balance * this.staking_percentage / 100 /2).toFixed(4);
   }

   netstakevalueChanged($event){
     if(this.net_staking_value < 0){
       this.presentAlert("Enter an amount above 0");
       this.net_staking_value = 0;
       this.staking_percentage = this.cpu_staking_value/this.available_balance * 100;
     }
     else{
       if(this.net_staking_value > (this.available_balance - this.cpu_staking_value)) {
        this.presentAlert("Enter an amount less than the available balance");
        this.net_staking_value = this.available_balance - this.cpu_staking_value;
        this.staking_percentage = 100;
      }
      else
        this.staking_percentage = (parseFloat(this.net_staking_value) + parseFloat(this.cpu_staking_value))/ this.available_balance * 100;
    }
   }

   cpustakevalueChanged($event){
     if(this.cpu_staking_value < 0) {
       this.presentAlert("Enter an amount above 0");
       this.cpu_staking_value = 0;
       this.staking_percentage = this.net_staking_value/this.available_balance * 100;
     }
     else{
       if(this.cpu_staking_value > (this.available_balance - this.net_staking_value)){
        this.presentAlert("Enter an amount below the available balance");
        this.cpu_staking_value = this.available_balance - this.net_staking_value;
        this.staking_percentage = 100;
      }
      else
        this.staking_percentage = (parseFloat(this.net_staking_value) + parseFloat(this.cpu_staking_value))/ this.available_balance * 100;
    }
   }

  onStake() {
    if(this.net_staking_value > 0 || this.cpu_staking_value > 0){
      this.showConfirm("This will stake "+this.cpu_staking_value +" EOS for CPU and "+this.net_staking_value+" EOS for Network").
      then((data) => {
        this.presentLoading();
        this.eos.transaction(tr => {
          tr.delegatebw({
            from: this.accountname,
            receiver: this.accountname,
            stake_net_quantity: (parseFloat(this.net_staking_value)).toFixed(4)+' EOS',
            stake_cpu_quantity: (parseFloat(this.cpu_staking_value)).toFixed(4)+' EOS',
            transfer: 0
          })
        }).then((data) => {
          this.loading.dismiss();
          this.ionViewDidLoad();
          this.presentConfirm("Successful Staking, do you want to view details at eospark.com?",data.transaction_id);
        }).catch((e) => {
          this.loading.dismiss();
          this.presentAlert(e.message);
        });
      }).catch((e) => {console.log(e);});
    } else
      this.presentAlert("Specify an amount to stake");
  }

  onUnstake() {
    if(this.cpu_unstaking_value > 0 || this.net_unstaking_value > 0){
      this.showConfirm("This will unstake "+this.cpu_unstaking_value +" EOS from CPU and "+this.net_unstaking_value+" EOS from Network").
      then((data) => {
        this.presentLoading();
        this.eos.transaction(tr => {
          tr.undelegatebw({
            from: this.accountname,
            receiver: this.accountname,
            unstake_net_quantity: (parseFloat(this.net_unstaking_value)).toFixed(4)+' EOS',
            unstake_cpu_quantity: (parseFloat(this.cpu_unstaking_value)).toFixed(4)+' EOS'
          })
        }).then((data) => {
          this.loading.dismiss();
          this.ionViewDidLoad();
          this.presentConfirm("Successful Unstaking, do you want to view details at eospark.com?",data.transaction_id);
        }).catch((e) => {
          this.loading.dismiss();
          this.presentAlert(e.message);
        });
      }).catch((e) => {console.log(e);});
    } else
      this.presentAlert("Specify an amount to unstake");
  }

}
