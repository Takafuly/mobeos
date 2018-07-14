import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {
  private SETTINGS_KEY: string = '_settings';

  settings: any;
  config: any = {};
  accountname: any;

  _defaults: any;
  _readyPromise: Promise<any>;

  constructor(public storage: Storage, defaults: any) {
    this._defaults = defaults;
  }

  load() {
    return this.storage.get(this.SETTINGS_KEY).then((value) => {
      if (value) {
        this.settings = value;
        return this._mergeDefaults(this._defaults);
      } else {
        return this.setAll(this._defaults).then((val) => {
          this.settings = val;
        })
      }
    });
  }

  _mergeDefaults(defaults: any) {
    for (let k in defaults) {
      if (!(k in this.settings)) {
        this.settings[k] = defaults[k];
      }
    }
    return this.setAll(this.settings);
  }

  merge(settings: any) {
    for (let k in settings) {
      this.settings[k] = settings[k];
    }
    return this.save();
  }

  setValue(key: string, value: any) {
    this.settings[key] = value;
    return this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  setAll(value: any) {
    return this.storage.set(this.SETTINGS_KEY, value);
  }

  getValue(key: string) {
    return this.storage.get(this.SETTINGS_KEY)
      .then(settings => {
        return settings[key];
      });
  }

  getEosConfig() {
    return this.config;
  }

  setEosConfigPK(pk) {
    this.config = {
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',//'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',//'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
        keyProvider: [pk], // WIF string or array of keys..
        httpEndpoint: 'https://mainnet.genereos.io',//'http://jungle.cryptolions.io:38888',//'http://br.eosrio.io:8080',
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

  save() {
    return this.setAll(this.settings);
  }

  get allSettings() {
    return this.settings;
  }
}
