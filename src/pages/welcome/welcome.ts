import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { STORAGE_KEYS } from '../../providers/config';
import * as Eos from 'eosjs';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})

export class WelcomePage {
  loading: any;
  eos: any;
  chain = 'eos';

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public settings: Settings,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
    this.settings.setChainTo(this.chain);
    this.connectEOS(settings.chainConfig);
    this.eos = Eos(settings.chainConfig);
  }

  chainChosen(chain)
  {
    // Switch chain configuration
    this.settings.setChainTo(this.chain);

    // Update cached chain
    this.storage.set(STORAGE_KEYS.CURRENT_CHAIN, this.chain);
    this.connectEOS(this.settings.chainConfig);
  }

  connectEOS(chainConfig) {
    this.eos = Eos(chainConfig);
    this.presentLoading();
    this.eos['getInfo']( (error, result) => {
      if(error){
        this.loading.dismiss();
        this.presentPrompt('Error connecting to the ' + chainConfig.chainName + '. Want to try with a different endpoint?');
      } else {
        this.loading.dismiss();
      }
    });
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({ content: 'Connecting to ' + this.settings.chainConfig.chainName + ' ...'});
    this.loading.present();
  }

  presentPrompt(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      inputs: [
        {
          name: 'endpoint',
          placeholder: 'https://...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Connect',
          handler: data => {
            this.settings.chainConfig.setEndpoint(data.endpoint);
            this.connectEOS(data.endpoint);
          }
        }
      ]
    });
    alert.present();
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  ionViewDidLoad() {
    this.settings.checkCachedChain();
    this.chain = this.settings.cachedChainKey;
  }
}
