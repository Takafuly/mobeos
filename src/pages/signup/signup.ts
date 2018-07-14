import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import * as Eos from 'eosjs';
import { Settings } from '../../providers/providers';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  ecc: any;
  eos: any;
  pk: any;
  pin: any;
  listAccts: any = [];

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public settings: Settings,
    public translateService: TranslateService) {
      //let config = settings.getEosConfig();
      let config = {
          chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',//'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',//'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
          httpEndpoint: 'https://mainnet.genereos.io',//'http://jungle.cryptolions.io:38888',//'http://br.eosrio.io:8080',
          expireInSeconds: 60,
          broadcast: true,
          verbose: false, // API activity
          sign: true
        };
      this.eos = Eos(config);
      this.ecc = Eos.modules['ecc'];
  }

  selectAccount() {

    // Object with options used to create the alert
    var options = {
      title: 'Choose an account name',
      message: 'This account will be the active account in the wallet',
      inputs: [],
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: data => {
            this.settings.setAccountName(data);
            console.log(data);
            this.navCtrl.push(MainPage);
          }
        }
      ]
    };

    options.inputs = [];

    for(let i=0; i< this.listAccts.length; i++) {
      options.inputs.push({ name : 'options', value: this.listAccts[i], label: this.listAccts[i], type: 'radio' });
    }

    let alert = this.alertCtrl.create(options);
    alert.present();
  }

  doSignup() {
      if(this.ecc.isValidPrivate(this.pk)){
        console.log("valid pk");
        let pubkey = this.ecc.privateToPublic(this.pk);
        console.log(pubkey);
        if (this.ecc.isValidPublic(pubkey)) {
          this.eos.getKeyAccounts(pubkey)
          .then((data) => {
            if (data['account_names'].length > 0) {
              console.log(data['account_names'][0]);
              this.settings.setEosConfigPK(this.pk);
              this.listAccts = data['account_names'];
              this.selectAccount();
              //this.settings.accountname = data['account_names'][1];
              //this.navCtrl.push(MainPage);
            }
          }).catch((e) => {
            console.log(e);
          });
        }
    }
    else{
      console.log("pk is not valid");
    }
  }

}
