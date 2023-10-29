# Rantom - Blockchain Data Explorer and Analytic for Human

![Node Shield](https://img.shields.io/badge/Node-%5E18.0.0-339933?style=flat-square&logo=Node.js)
![Typescript Shield](https://img.shields.io/badge/Typescript-%5E4.6.3-3178C6?style=flat-square&logo=TypeScript)
[![Web3.js](https://img.shields.io/badge/web3.js-%5E1.10.1-F16822?style=flat-square&logo=web3.js)](https://web3js.readthedocs.io/en/v1.10.0/)
![MongoDB Shield](https://img.shields.io/badge/MongoDB-bionic-47A248?style=flat-square&logo=mongodb)

Rantom is an open source blockchain data explorer and analytic platform. 

Rantom is heavy focus on DeFi and NFT contexts where it extracts more and more insight data from transaction more as more possible.
Unlikely with a pure blockchain explorer like [etherscan](https://etherscan.io), Rantom focus on showing human activities on every transaction.

For example, instead of showing a raw log dat like this:

```json
{
  "transactionHash": "0xc1d26c553de382f326362aa377968262369a0f73aa7a8b6db49d6c40635b9bef",
  "address": "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
  "blockHash": "0x153a2369466fbe3c56ea046f0f7e14ea0cccc129fa6373642a99d2d07cdf0162",
  "blockNumber": "0xfdd172",
  "data": "0x0000...031781",
  "logIndex": "0xca",
  "removed": false,
  "topics": [
    "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
    "0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b",
    "0x000000000000000000000000ef1c6e67703c7bd7107eed8303fbe6ec2554bf6b"
  ],
  "transactionIndex": "0x63"
}
```

Rantom detects and shows this as a token swapping on Uniswap v3 on Ethereum blockchain.

## Tech stack and libraries

- Database: Mongo DB
- Languages: Typescript (ES2017 - commonjs)
- Ethereum (evm-based) libraries: web3.js version 4.x.x

## Licensing

This software itself is MIT licensed and redistributes MIT-compatible dependencies.

## Getting in touch

Our Discord server: https://discord.com/invite/ehNqJA2BrV

## Contribution

If you want to help, feel free to open a pull request 🙌

If you enjoy this project, you can support Rantom some server cost. Thank you!  
[0x254b42CaCf7290e72e2C84c0337E36E645784Ce1](https://etherscan.io/address/0x254b42CaCf7290e72e2C84c0337E36E645784Ce1)
