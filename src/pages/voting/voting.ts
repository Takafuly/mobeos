import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Settings } from '../../providers/providers';

import * as Eos from 'eosjs';


@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'voting.html'
})
export class VotingPage {

  listProducers: any = [];
  searchedProducers: any = [];
  votinglist: any = [];
  eos: any;
  loading: any;
  accountName: any;
  searchInput: any;


  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, private iab: InAppBrowser, public settings: Settings) {
    this.loading = this.loadingCtrl.create({ content: 'Please wait...' });
    let config = settings.getEosConfig();
    this.eos = Eos(config);
    this.accountName = this.settings.accountName;
    this.ionViewDidLoad();

  }

  ionViewDidLoad() {
    this.eos['getProducers']({ json: true, limit: 200 }, (error, result) => {
      if (error)
        console.log(error)
      if (result) {
        this.listProducers = result.rows;
        this.listProducers.forEach(function (obj) { obj.checked = false; });
        this.votinglist = [];
        this.shuffleList(this.listProducers);
        console.log(this.listProducers);
      }
    });
  }

  selectBP() {
    // Object with options used to create the alert
    var options = {
      title: 'BP Search Results',
      message: 'Select the BPs that matches your search',
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
            if (this.votinglist.length + data.length > 30)
              this.presentAlert("You have exceeded the maximum number (30) of BPs for voting");
            else {
              this.votinglist = this.votinglist.concat(data);
            }
            //this.settings.setAccountName(data);
            console.log(data);
          }
        }
      ]
    };

    options.inputs = [];
    for (let i = 0; i < this.searchedProducers.length; i++) {
      options.inputs.push({ name: 'options', value: this.searchedProducers[i].owner, label: this.searchedProducers[i].owner, type: 'checkbox' });
    }
    let alert = this.alertCtrl.create(options);
    alert.present();
  }

  onInput() {
    if (this.searchInput != '') {
      this.presentLoading();
      this.searchedProducers = [];
      console.log(this.searchInput);
      let searchTerm = this.searchInput;
      let tempProducers = this.searchedProducers;

      this.eos['getProducers']({ json: true, limit: 500 }, (error, result) => {
        if (error)
          this.loading.dismiss();
        if (result) {
          //this.searchedProducers = result.rows;
          let searchResult = result.rows;
          searchResult.forEach(function (obj) {
            if ((obj.owner).includes(searchTerm)) {
              tempProducers.push(obj);
            }
          });
          //let allList = this.listProducers;
          this.loading.dismiss();
          this.selectBP();
          //searchResult.forEach(function(obj) { if(allListobj.producer == ) = false;});
        }
      });
    }
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({ content: 'Please wait...' });
    this.loading.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  proxyPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Set Proxy',
      subTitle: 'Enter the account name for the proxy you want to delegate your vote to',
      inputs: [
        {
          name: 'proxy',
          placeholder: 'proxy account name'
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
          text: 'Set',
          handler: data => {
            if (data.proxy != '')
              this.setProxy(data.proxy);
          }
        }
      ]
    });
    alert.present();
  }

  showConfirm(message: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

      let confirm = this.alertCtrl.create({
        title: '',
        message: message,
        buttons: [{
          text: 'CANCEL',
          handler: () => {
            reject();
          }
        }, {
          text: 'OK',
          handler: () => {
            resolve(true);
          }
        }]
      });

      confirm.present();
    });
  }

  presentConfirm(msg, id) {
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
            this.iab.create(this.settings.chainConfig.chainExplorerTxnUrl + id, "_blank");
          }
        }
      ]
    });
    alert.present();
  }


  shuffleList(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }


  updatelist(producer) {
    producer.checked = !producer.checked;
    if (producer.checked == true) {
      this.votinglist.push(producer.owner);
      if (this.votinglist.length == 30)
        this.presentAlert("You have selected the maximum number (30) of BPs for voting");
    }
    else {
      var index = this.votinglist.indexOf(producer.owner);
      this.votinglist.splice(index, 1);;
    }
    console.log(this.votinglist);
  }

  openItem(producer) {
    this.navCtrl.push('ProducerDetailPage', {
      item: producer
    });
  }

  castvote() {
    if (this.votinglist.length > 0 && this.votinglist.length < 31) {
      this.showConfirm("This will cast a vote for the selected BPs").
        then((data) => {
          this.presentLoading();
          this.votinglist.sort();
          this.eos.transaction(tr => {
            tr.voteproducer({
              voter: this.accountName,
              proxy: "",
              producers: this.votinglist,
            })
          }).then((data) => {
            this.loading.dismiss();
            this.ionViewDidLoad();
            this.presentConfirm("This was a successful vote, do you want to view details of the action at eospark.com?", data.transaction_id);
          }).catch((e) => {
            this.loading.dismiss();
            this.presentAlert(e.message);
          });
        }).catch((e) => { console.log(e); });
    } else
      this.presentAlert("voting list should contain a number of BPs between 1 and 30");
  }

  setProxy(proxyName) {
    this.presentLoading();
    this.eos.transaction(tr => {
      tr.voteproducer({
        voter: this.accountName,
        proxy: proxyName,
      })
    }).then((data) => {
      this.loading.dismiss();
      this.ionViewDidLoad();
      this.presentConfirm("You have sucussfully set a proxy for voting, do you want to view details of the action at eospark.com?", data.transaction_id);
    }).catch((e) => {
      this.loading.dismiss();
      this.presentAlert(e.message);
    });
  }


  refresh() {
    this.ionViewDidLoad();
  }

}
