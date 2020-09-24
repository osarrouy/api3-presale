usePlugin('@nomiclabs/buidler-solhint');
usePlugin('@nomiclabs/buidler-truffle5');
usePlugin('@nomiclabs/buidler-etherscan');
usePlugin('buidler-deploy');
usePlugin('buidler-gas-reporter');
usePlugin('solidity-coverage');

module.exports = {
  solc: {
    version: '0.6.2',
    optimizer: { enabled: true, runs: 1000 },
  },
  etherscan: {
    url: 'https://api-rinkeby.etherscan.io/api',
    apiKey: 'ZXW2Y7U3665YIGZZZUEFK3B59NWIK6X3DR',
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      4: '0xb71d2d88030a00830c3d45f84c12cc8aaf6857a5',
    },
  },
  networks: {
    private: {
      url: 'http://127.0.0.1:8545',
    },
    rinkeby: {
      url: 'http://127.0.0.1:1248',
    },
    coverage: {
      gas: 0x1fffffffffffff,
      url: 'http://localhost:8555',
    },
  },
};
