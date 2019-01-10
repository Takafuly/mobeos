// Singleton pattern
export class TelosTestnetConnectionConfig {

    private static instance: TelosTestnetConnectionConfig;
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
        this.pKeyPrefix = 'TLOS';
        this.systemTokenName = 'TLOS';
        this.mainContractName = 'tlos.token';
        this.chainName = "TELOS Testnet";
        this.chainId = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'; // 32 byte (64 char) hex string
        this.httpEndpoint = 'http://api.telos.eosindex.io'; // Telos Testnet Endpoint
        this.expireInSeconds = 60;
        this.broadcast = true;
        this.verbose = true; // API activity
        this.sign = true;
        this.chainExplorerTxnUrl = "http://testnet.telosfoundation.io/transactions/";
        this.tokensList = [];
    }

    setKeyProvider(pk: any)
    {
        this.keyProvider = [pk];
    }

    getTokensList()
    {
        return this.tokensList;
    }

    setTokensList(_tokensList)
    {
        this.tokensList = _tokensList;
    }

    setEndpoint(httpEndpoint: string)
    {
        this.httpEndpoint = httpEndpoint;
    }

    static getInstance() {
        if (!TelosTestnetConnectionConfig.instance) {
            TelosTestnetConnectionConfig.instance = new TelosTestnetConnectionConfig();
        }
        return TelosTestnetConnectionConfig.instance;
    }
}
