import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as Eos from 'eosjs';
import CryptoJS from 'crypto-js';

import { Settings } from '../../providers/providers';
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
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public settings: Settings,
    public storage: Storage,
    public translateService: TranslateService) {

    this.eos = Eos(settings.chainConfig);
    this.ecc = Eos.modules['ecc'];
    console.log(this.settings.getTokensList());
  }

  generateKey(p){
    var salt = "E1F53135E559C253";
    return CryptoJS.PBKDF2(p, salt, { keySize: 512/32, iterations: 1000 });
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
            this.storeAccount(data);
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

  storeAccount(data) {
    let skey = this.generateKey(this.pin);
    //console.log("skey"+skey.toString());
    var accountdata = {key: this.pk, name: data};
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(accountdata), skey.toString());
    this.storage.set(skey.toString(),ciphertext.toString());
  }

  doSignup() {
      if(this.ecc.isValidPrivate(this.pk)){
        console.log('valid pk');
        let pubkey = this.ecc.privateToPublic(this.pk);

        if (this.ecc.isValidPublic(pubkey)) {
          
          // Check if public key format is prefixed differently
          if(this.settings.getEosConfig().pKeyPrefix != 'EOS'){
            pubkey = pubkey.replace('EOS', this.settings.getEosConfig().pKeyPrefix);
          }

          this.eos.getKeyAccounts(pubkey)
          .then((data) => {
            if (data['account_names'].length > 0) {
              //console.log(data['account_names'][0]);
              this.settings.setEosConfigPK(this.pk);
              this.listAccts = data['account_names'];
              this.selectAccount();
            }
          }).catch((e) => {
            alert("Error on getting list of accounts associated with this key");
          });
        }
        else {
          alert("Private Key is not valid");
        }
    }
    else{
      alert("Private Key is not valid");
    }
  }

}
