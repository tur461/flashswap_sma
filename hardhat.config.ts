import 'hardhat-deploy';
import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import { HardhatUserConfig } from 'hardhat/config';

const chainIds = {
    goerli: 5,
    hardhat: 1337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
    bsctest: 97,
    bscmain: 56,
    cronosTest: 338,
};

dotenv.config();

const INFURA_TOKEN = process.env.INFURA_TOKEN;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
      compilers: [
          {
              version: "0.8.7",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              
              },
          },
          {
              version: "0.8.0",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              
              },
          },
          {
              version: "0.8.10",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              
              },
          },
          {
              version: "0.8.11",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              },
          },
          {
              version: "0.8.4",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              },
          },
          {
              version: "0.8.10",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              },
          },
          {
              version: "0.7.5",
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              },
          },
          {
              version: "0.5.16",
          },
          {
              version: "0.6.0",
          },
          {
              version: "0.8.10",
  
  
              settings: {
                  metadata: {
                      bytecodeHash: "none",
                  },
                  optimizer: {
                      enabled: true,
                      runs: 1,
                  },
              },
          },
      ],
      settings: {
          outputSelection: {
              "*": {
                  "*": ["storageLayout"],
              },
          },
      },
    },
    networks: {
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_TOKEN}`,
            accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
            chainId: chainIds.rinkeby,
        },
        local: {
          url: 'http://127.0.0.1:8545/',
        },
        hardhat: {
          allowUnlimitedContractSize: !1,
        },
    },
    paths: {
        tests: "./test",
        cache: "./cache",
        sources: "./contracts",
        deploy: "./scripts/deploy",
        artifacts: "./artifacts",
        deployments: "./deployments",
    },
    mocha: {
        timeout: 60000,
    },
};

export default config;

