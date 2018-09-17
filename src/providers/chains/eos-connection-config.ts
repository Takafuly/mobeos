// Singleton pattern
export class EosConnectionConfig {

    private static instance: EosConnectionConfig;
    chainName: string;
    chainId: any;
    httpEndpoint: any;
    expireInSeconds: any;
    broadcast: any;
    verbose: any;
    sign: any;
    tokensList: any;
    keyProvider: any;
    chainExplorerTxnUrl: any;
    pKeyPrefix: string;
    systemTokenName: string;
    mainContractName: string;

    constructor() {
        this.pKeyPrefix = 'EOS';
        this.systemTokenName = 'EOS';
        this.mainContractName = 'eosio.token';
        this.chainName = "EOS Mainnet";
        this.chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'; // 32 byte (64 char) hex string
        this.httpEndpoint = 'https://eos.greymass.com:443';
        this.expireInSeconds = 60;
        this.broadcast = true;
        this.verbose = true; // API activity
        this.sign = true;
        this.chainExplorerTxnUrl = "https://eospark.com/MainNet/tx/"; //"https://bloks.io/transaction/"; //
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
          ];
    }

    getTokensList()
    {
        return this.tokensList;
    }

    setTokensList(_tokensList)
    {
        this.tokensList = _tokensList;
    }

    setKeyProvider(pk: any)
    {
        this.keyProvider = [pk];
    }

    setEndpoint(httpEndpoint: string)
    {
        this.httpEndpoint = httpEndpoint;
    }

    static getInstance() {
        if (!EosConnectionConfig.instance) {
            EosConnectionConfig.instance = new EosConnectionConfig();
        }
        return EosConnectionConfig.instance;
    }
}
