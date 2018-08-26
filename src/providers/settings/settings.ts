import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {EosConnectionConfig} from '../chains/eos-connection-config';
import {EosTestnetConnectionConfig} from '../chains/eos-testnet-connection-config'; 
import {TelosTestnetConnectionConfig} from '../chains/telos-testnet-connection-config';
import { STORAGE_KEYS } from '../config';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {

  chainConfig: any = {};
  accountName: any;

  constructor(public storage: Storage) {

    this.storage.get(STORAGE_KEYS.CURRENT_CHAIN)
      .then((val) => {
        // Switch to cached chain
        this.setChainTo(val);
        console.log("cached is" + val);
      }).catch(error => {
        // Use default chain
        this.chainConfig = EosConnectionConfig.getInstance();
      });

      console.log("1");
  }

  setChainTo(chainKey: string)
  {
    switch(chainKey) { 
      case 'telos': { 
        this.chainConfig = TelosTestnetConnectionConfig.getInstance();
        break; 
      } 
      case 'jungle': { 
        this.chainConfig = EosTestnetConnectionConfig.getInstance(); 
        break; 
      } 
      case 'eos': { 
        this.chainConfig = EosConnectionConfig.getInstance(); 
        break; 
      }
      default: { 
        this.chainConfig = EosConnectionConfig.getInstance();
        break; 
      } 
   } 
  }

  getTokensList() {
    return this.chainConfig.getTokensList();
  }

  getEosConfig() {
    return this.chainConfig;
  }

  setEosConfigPK(pk) {
    this.chainConfig.setKeyProvider(pk);
  }

  getAccountName() {
    return this.accountName;
  }

  setAccountName(acctName) {
    this.accountName = acctName;
  }

  saveAccount(accountName,key) {
    this.storage.set(key, accountName);
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
