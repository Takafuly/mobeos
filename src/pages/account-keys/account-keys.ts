import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-account-keys',
  templateUrl: 'account-keys.html'
})
export class AccountKeysPage {
  @ViewChild('fileInput') fileInput;

  owner_key: any;
  active_key: any;
  owner_pkey: any;
  active_pkey: any;


  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
      this.active_pkey = navParams.get('active_pkey');
      this.owner_pkey = navParams.get('owner_pkey');
      this.active_key = navParams.get('active_key');
      this.owner_key = navParams.get('owner_key');
  }

  ionViewDidLoad() {

  }


  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

}
