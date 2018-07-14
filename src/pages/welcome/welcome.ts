import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';

import * as Eos from 'eosjs';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  loading: any;
  eos: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.connectEOS('https://mainnet.genereos.io');
  }

  connectEOS(endpoint) {
    let config = {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',//'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',//'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
        httpEndpoint: endpoint,//'http://jungle.cryptolions.io:38888',//'http://br.eosrio.io:8080',
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
      };
    this.eos = Eos(config);
    this.presentLoading();
    this.eos['getInfo']( (error, result) => {
      if(error){
        this.loading.dismiss();
        this.presentPrompt("Error connecting to the EOS mainnet. Want to try with a different endpoint?");
      } else {
        this.loading.dismiss();
      }
    });
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({ content: 'Connecting to EOS mainnet ...'});
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
}
