require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20", // or your preferred Solidity version
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]  // Private key for a local account 0
    }
  },
  /* gasReporter: {
    enabled: true,
    currency: 'USD',
    // gasPrice: 21,
    currencyDisplayPrecision: 3,
    // ethPrice: 2000,
    coinmarketcap: "61639cff-8271-45d5-b295-d08745f0d50f"
  }, */
  /* gasReporter: {
    offline: true,
    L2: "optimism",
    gasPrice: .00325,      // gwei (L2)
    baseFee: 35,           // gwei (L1)
    blobBaseFee: 20,       // gwei (L1)
    tokenPrice: "1",       // ETH per ETH
    token: "ETH"
  } */
    gasReporter: {
      L2: "optimism",
      // Requires api keys for both Ethereum Mainnet and Optimism
      L1Etherscan: "BDYFSJ2KUPMSCAKKP7MZ5KY17MEF4U6XHG",   // https://etherscan.io/apidashboard
      L2Etherscan: "3G6PZVQ71DBZS5CWNUVMQFPSJQ3C1VA17M",  // https://optimistic.etherscan.io/apidashboard
      currency: "USD",
      coinmarketcap: "61639cff-8271-45d5-b295-d08745f0d50f", // https://coinmarketcap.com/api/pricing/
      currencyDisplayPrecision: 3
    }
};