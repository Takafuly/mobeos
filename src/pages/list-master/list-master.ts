import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Settings } from '../../providers/providers';
import { FirstRunPage } from '../pages';
import * as Eos from 'eosjs';
import { GET_TOKEN_URL } from '../../providers/config';


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
  tokensList: any = [];
  accountName: any;
  loading: any;
  apiUrl: any = GET_TOKEN_URL;
  mainTokenName: any;

  constructor(public navCtrl: NavController, public settings: Settings, public modalCtrl: ModalController,
              public loadingCtrl: LoadingController, public _http: HttpClient) {

    this.mainTokenName = this.settings.getChainPKeyPrefix();
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountName = this.settings.accountName;
    this.tokensList = this.settings.getTokensList();
    this.loadData();

  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({ content: 'Please wait...'});
    this.loading.present();
  }

  listTokens(){

    let addModal = this.modalCtrl.create('TokensPage',{tokens: this.tokens});
    addModal.present();
  }

  addAccount() {

    let addModal = this.modalCtrl.create('AccountCreatePage',{eos:this.eos,acct:this.accountName});
    addModal.present();
  }


  loadData() {
    this.presentLoading();
    this.tokens = [];
    this.eos['getAccount'](this.accountName, (error, result) => {
      if(error){
        console.log(error);
        this.loading.dismiss();
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
    this.getTokensData()
    .then(data => {
      this.tokensList = data;
      console.log(this.tokensList);
      for (var i = 0; i < this.tokensList.length; i++) {
        this.getTokenBalance(this.tokensList[i].contract,this.tokensList[i].url,this.eos,this.accountName,this.tokens);
      }
      this.loading.dismiss();
    }).catch((e) => {
      console.log("tokens");
      for (var i = 0; i < this.tokensList.length; i++) {
        this.getTokenBalance(this.tokensList[i].contract,this.tokensList[i].url,this.eos,this.accountName,this.tokens);
      }
      this.loading.dismiss();
    });
    // for (var i = 0; i < this.tokensList.length; i++) {
    //   this.getTokenBalance(this.tokensList[i].contract,this.eos,this.accountName,this.tokens);
    // }

  }


  getTokensData() {
    return new Promise((resolve, reject) => {
      this._http.get(this.apiUrl,{headers: new HttpHeaders().set('Authorization', 'Basic YWRtaW46bW9ibW9iZW9zZW9z')}).
      subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  getTokenBalance(tknContract,tokenUrl,eos,acct,tokenBal) {
      eos['getCurrencyBalance'](tknContract, acct, (error, result) => {
        if(result){
          if(result[0])
            tokenBal.push({bal:result[0],url:tokenUrl});
        }
      });
  }

  lock() {
    this.navCtrl.push(FirstRunPage);
    
    // Hide Bottom Tab bar
    this.settings.displayTab(false);
  }

  refresh() {
    this.loadData();
  }

}
