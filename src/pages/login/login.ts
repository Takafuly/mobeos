import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import CryptoJS from 'crypto-js';

import { Settings } from '../../providers/providers';

import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  pin : any;
  // Our translated text strings

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public settings: Settings,
    public storage: Storage,
    public navParams: NavParams,
    public translateService: TranslateService) {

  }

  generateKey(p){
    var salt = "E1F53135E559C253";
    return CryptoJS.PBKDF2(p, salt, { keySize: 512/32, iterations: 1000 });
  }

  getAccount() {
    let skey = this.generateKey(this.pin);
    this.storage.get(this.settings.getEosConfig().pKeyPrefix+(skey.toString()).slice(0,(skey.toString()).length/2))
      .then((val) => {
        var bytes  = CryptoJS.AES.decrypt(val, skey.toString());
        var plaintext = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.settings.setEosConfigPK(plaintext.key);
        this.settings.setAccountName(plaintext.name);
        this.doLogin();
      }).catch(error => {
        alert("Unable to retrieve wallet");
      });
  }

  // Attempt to login in through our User service
  doLogin() {
      this.navCtrl.push(MainPage);
  }

}
