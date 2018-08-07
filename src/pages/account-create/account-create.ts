import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, AlertController, ModalController} from 'ionic-angular';

import * as Eos from 'eosjs';

@IonicPage()
@Component({
  selector: 'page-account-create',
  templateUrl: 'account-create.html'
})
export class AccountCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  eos: any;
  ecc: any;
  acct_creator: any;
  acct_name: any;
  owner_key: any;
  active_key: any;
  owner_pkey: any;
  active_pkey: any;
  transfer: boolean = true;
  ram: any = 8192;
  cpu_stake: any = 0.1;
  net_stake: any = 0.1;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,
              public alertCtrl: AlertController, public modalCtrl: ModalController) {
      this.eos = navParams.get('eos');
      this.acct_creator = navParams.get('acct');
      this.ecc = Eos.modules['ecc'];
  }

  ionViewDidLoad() {

  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
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

          }
        }
      ]
    });
    alert.present();
  }

  genKeys() {
    this.ecc.randomKey().then(privateKey => {
      this.owner_pkey = privateKey;
      console.log("Owner PK"+this.owner_pkey);
      this.owner_key = this.ecc.privateToPublic(privateKey);
      console.log("Owner PUB"+this.owner_key); // EOSkey...
    });
    this.ecc.randomKey().then(privateKey => {
      this.active_pkey = privateKey;
      console.log("Active PK"+this.active_pkey);
      this.active_key = this.ecc.privateToPublic(privateKey);
      console.log("Active PUB"+this.active_key); // EOSkey...
      let addModal = this.modalCtrl.create('AccountKeysPage',{owner_pkey:this.owner_pkey,owner_key:this.owner_key,active_pkey:this.active_pkey,active_key:this.active_key});
      addModal.present();
    });

  }

  createAccount() {
    this.eos.transaction(tr => {
        tr.newaccount({
          creator: this.acct_creator,
          name: this.acct_name,
          owner: this.owner_key,
          active: this.active_key
        })
        tr.buyrambytes({
          payer: this.acct_creator,
          receiver: this.acct_name,
          bytes: Number(this.ram)
        })
        tr.delegatebw({
          from: this.acct_creator,
          receiver: this.acct_name,
          stake_net_quantity: this.net_stake + ' EOS',
          stake_cpu_quantity: this.cpu_stake + ' EOS',
          transfer: this.transfer ? 1:0
        })
      }).then((data) => {
        console.log(data.transaction_id);
      }).catch((e) => {
        console.log(e);
      });
    }
  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    this.viewCtrl.dismiss();
  }
}
