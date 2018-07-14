import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Eosconfig {
  config: any;
  accountname: any;
  //ecc: any;

  constructor() {
    this.config = {
        chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',//'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
        keyProvider: ['5Jr3rDiP8YHwKArtT8jr2rFGa11Yn5Ye5FczRJ6kQBXQDKS3f56'],//['5KNu7gU9U7FP3nxxDhjCQ2nn6XN3MXikF3mE9VQ6J76quJrScCr'], // WIF string or array of keys..
        httpEndpoint: 'http://jungle.cryptolions.io:38888',//'http://br.eosrio.io:8080',
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
      }
    //
  }

  setEosConfig(value) {
    this.config = {
        chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',//'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
        keyProvider: ['5Jr3rDiP8YHwKArtT8jr2rFGa11Yn5Ye5FczRJ6kQBXQDKS3f56'],//['5KNu7gU9U7FP3nxxDhjCQ2nn6XN3MXikF3mE9VQ6J76quJrScCr'], // WIF string or array of keys..
        httpEndpoint: 'http://jungle.cryptolions.io:38888',//'http://br.eosrio.io:8080',
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
      };
  }

  getActiveAccount() {
    return this.accountname;
  }

  getEosConfig() {
    return this.config;
  }

  setEosConfigPK(pk) {
    return this.config.keyProvider = [pk];
  }

}
