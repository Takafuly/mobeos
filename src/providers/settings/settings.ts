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
  cachedChainKey: any;

  constructor(public storage: Storage) {
    this.checkCachedChain();
  }
  
  checkCachedChain()
  {
    this.storage.get(STORAGE_KEYS.CURRENT_CHAIN)
    .then((val) => {
      // Switch to cached chain
      this.setChainTo(val);
      this.cachedChainKey = val;
    }).catch(error => {
      // Use default chain
      this.chainConfig = EosConnectionConfig.getInstance();
      this.cachedChainKey = 'eos';
    });
  }

  setChainTo(chainKey: string)
  {
    switch(chainKey) { 
      case 'telos': { 
        this.chainConfig = TelosTestnetConnectionConfig.getInstance();
        this.cachedChainKey = 'telos';
        break; 
      } 
      case 'jungle': { 
        this.chainConfig = EosTestnetConnectionConfig.getInstance(); 
        this.cachedChainKey = 'jungle';
        break; 
      } 
      case 'eos': { 
        this.chainConfig = EosConnectionConfig.getInstance(); 
        this.cachedChainKey = 'eos';
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

  getChainPKeyPrefix()
  {
    return this.chainConfig.pKeyPrefix;
  }

  getChainTokenName()
  {
    return this.chainConfig.systemTokenName;
  }

  getChainTokenContractName()
  {
    return this.chainConfig.mainContractName;
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

  displayTab(display:boolean) {
      let elements = document.querySelectorAll(".tabbar");

      console.log("hide bar");

      if (elements != null) {
          Object.keys(elements).map((key) => {
              elements[key].style.transform = display ? 'translateY(0)' : 'translateY(56px)';
          });
      }
  }

}
