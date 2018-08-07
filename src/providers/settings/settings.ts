import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {

  config: any = {};
  accountname: any;
  endpoint: any = 'https://eu1.eosdac.io:443';
  tokensList: any = [];



  constructor(public storage: Storage) {
    this.config = {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',//'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // 32 byte (64 char) hex string
        httpEndpoint: 'https://eu1.eosdac.io:443',//'https://mainnet.genereos.io',//'http://jungle.cryptolions.io:38888',
        expireInSeconds: 60,
        broadcast: true,
        verbose: true, // API activity
        sign: true
      };

  }

  getTokensList() {
    this.tokensList = [
      {symbol:'EOSDAC', contract:'eosdactokens'},
      {symbol:'ADD', contract: 'eosadddddddd'},
      {symbol:'EOX', contract: 'eoxeoxeoxeox'},
      {symbol:'EDNA', contract: 'ednazztokens'},
      {symbol:'ATD', contract: 'eosatidiumio'},
      {symbol:'CET', contract: 'eosiochaince'},
      {symbol:'HORUS', contract: 'horustokenio'},
      {symbol:'KARMA', contract: 'therealkarma'},
      {symbol:'ESB', contract: 'esbcointoken'},
      {symbol:'IQ', contract: 'everipediaiq'},
      {symbol:'CHL', contract: 'challengedac'}
    ]
    return this.tokensList;
  }

  getEosConfig() {
    return this.config;
  }

  setEosConfigPK(pk) {
    this.config = {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',//'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // 32 byte (64 char) hex string
        keyProvider: [pk], // WIF string or array of keys..
        httpEndpoint: this.endpoint,//'https://mainnet.genereos.io',//'http://jungle.cryptolions.io:38888',
        expireInSeconds: 60,
        broadcast: true,
        verbose: true, // API activity
        sign: true
      };
  }

  setEosConifgEndpoint(endpoint) {
    this.endpoint = endpoint;
    this.config = {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',//'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // 32 byte (64 char) hex string
        httpEndpoint: this.endpoint,//'https://mainnet.genereos.io',//'http://jungle.cryptolions.io:38888',
        expireInSeconds: 60,
        broadcast: true,
        verbose: true, // API activity
        sign: true
      };
  }

  getAccountName() {
    return this.accountname;
  }

  setAccountName(acctName) {
    this.accountname = acctName;
  }

  saveAccount(accountdata,key) {
    this.storage.set(key, accountdata);
  }

  getAccount(key) {
    console.log(this.storage.keys());
    console.log((this.storage.get(key)));
    let data = null;
    this.storage.get(key)
      .then((val) => {
        data = val;
        console.log(data);
      }).catch(error => {
        data = null;
      });
      return data;
  }

}
