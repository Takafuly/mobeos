import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  createAccount() {
    // this.eos.transaction(tr => {
    //     tr.newaccount({
    //       creator: this.acct_creator,
    //       name: this.acct_name,
    //       owner: this.pubkey_owner,
    //       active: this.pubkey_active
    //     })
    //     tr.buyrambytes({
    //       payer: this.acct_creator,
    //       receiver: this.acct_name,
    //       bytes: Number(this.ram)
    //     })
    //     tr.delegatebw({
    //       from: this.acct_creator,
    //       receiver: this.acct_name,
    //       stake_net_quantity: this.net + ' EOS',
    //       stake_cpu_quantity: this.cpu + ' EOS',
    //       transfer: this.transfer ? 1:0
    //     })
    //   }).then((data) => {
    //     console.log(data.transaction_id);
    //     this.setState({loading:false, error:false, success: data.transaction_id});
    //   }).catch((e) => {
    //     let error = JSON.stringify(e);
    //     this.setState({loading:false, error:true});
    //
    //     if(error.includes('name is already taken')) {
    //       this.setState({reason:'Someone already owns that name.'});
    //     } else if(error.includes('Missing required accounts')) {
    //       this.setState({reason:'Incorrect scatter account - please review chain id, network, and account name.'});
    //     }
    //   });
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
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}
