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
        this.chainId = '6c8aacc339bf1567743eb9c8ab4d933173aa6dca4ae6b6180a849c422f5bb207'; // 32 byte (64 char) hex string
        this.httpEndpoint = 'http://144.202.89.120:8888'; // Telos Testnet Endpoint
        this.expireInSeconds = 60;
        this.broadcast = true;
        this.verbose = true; // API activity
        this.sign = true;
        this.chainExplorerTxnUrl = "";
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