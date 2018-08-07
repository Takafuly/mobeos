import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import * as Eos from 'eosjs';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  loading: any;
  eos: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              public settings: Settings, public alertCtrl: AlertController) {

    this.connectEOS('https://eu1.eosdac.io:443');
  }

  connectEOS(endpoint) {
    let config = {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
        httpEndpoint: endpoint,
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
            this.settings.setEosConifgEndpoint(data.endpoint);
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
