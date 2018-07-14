import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { Settings } from '../../providers/providers';

import * as Eos from 'eosjs';


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
})
export class ListMasterPage {
  eos: any;
  account_name: any;
  account_info: any = {};
  total_balance: any;
  staked_balance: any;
  staked_balance_percentage: any;
  unstaked_balance_percentage: any;
  unstaked_balance: any;
  available_cpu_time: any;
  used_cpu_time: any;
  available_bw: any;
  used_bw: any;
  available_ram: any;
  used_ram: any;
  cpu_usage_percentage: any;
  bw_usage_percentage: any;
  ram_usage_percentage: any;
  tokens: any = [];
  tokensname: any = [];
  tokensvalue: any = [];
  accountname: any;

  constructor(public navCtrl: NavController, public settings: Settings, public modalCtrl: ModalController) {
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountname = this.settings.accountname;
    this.ionViewDidLoad();

  }

  listTokens(){
    let addModal = this.modalCtrl.create('TokensPage',{tokens: this.tokens});
    addModal.present();
  }


  addAccount() {

  }


  ionViewDidLoad() {
    this.eos['getAccount'](this.accountname, (error, result) => {
      if(error){
        console.log(error);
      }
      if(result){
        console.log(result);
        this.account_info = result;
        this.total_balance = (parseFloat(result.core_liquid_balance)+parseFloat(result.total_resources.cpu_weight)+parseFloat(result.total_resources.net_weight)).toFixed(4);
        this.staked_balance = (parseFloat(result.total_resources.cpu_weight)+parseFloat(result.total_resources.net_weight)).toFixed(4);
        this.unstaked_balance = (this.total_balance - this.staked_balance).toFixed(4);
        this.staked_balance_percentage = this.staked_balance/this.total_balance*100;
        this.unstaked_balance_percentage = 100 - this.staked_balance_percentage;
        this.available_cpu_time = (this.account_info.cpu_limit.available/60/1000000).toFixed(2);
        this.used_cpu_time = (this.account_info.cpu_limit.used/60/1000000).toFixed(2);
        this.available_bw = (this.account_info.net_limit.available/1024/1024).toFixed(2);
        this.used_bw = (this.account_info.net_limit.used/1024/1024).toFixed(2);
        this.available_ram = (this.account_info.ram_quota/1024).toFixed(2);
        this.used_ram = (this.account_info.ram_usage/1024).toFixed(2);
        this.ram_usage_percentage = this.used_ram/this.available_ram*100;
        this.cpu_usage_percentage = this.used_cpu_time/this.available_cpu_time*100;
        this.bw_usage_percentage = this.used_bw/this.available_bw*100;
      }
    });

    this.eos['getCurrencyBalance']('eosio.token', this.accountname, (error, result) => {
      if(error)
        console.log(error);
      if(result){
        console.log(result);
        this.tokens = result;
      }
    });

    this.eos['getCurrencyBalance']('everipediaiq', this.accountname, (error, result) => {
      if(error)
        console.log(error);
      if(result){
        console.log(result);
        this.tokens = result;
      }
    });

    this.eos.getActions('eosadddddddd').then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    });

    this.eos['getActions']({
      account_name: this.accountname,
      offset: -500,
      pos: -1
    }).then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    });
  }

  refresh() {
    this.ionViewDidLoad();
  }

}
