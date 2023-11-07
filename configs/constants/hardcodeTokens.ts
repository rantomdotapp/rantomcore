import { Token } from '../../types/configs';
import EulerTokens from '../data/EulerEAndDTokens.json';

// some protocols using tokens which don't exist
// an ERC20 address on blockchain
// these mocking tokens will be used for them
// for example, synthetix protocol allow trading ADA token
// but the ADA token doesn't have an address on Optimism
export const MockingTokens: { [key: string]: string } = {
  BTC: '0x47904963fc8b2340414262125af798b9655e58cd', // from Gmx v2
  DOGE: '0xc4da4c24fd591125c3f47b340b6f4f76111883d8', // from Gmx v2
  LTC: '0xb46a094bc4b0adbd801e14b9db95e05e28962764', // from Gmx v2
  XRP: '0xc14e065b0067de91534e032868f5ac6ecf2c6868', // from Gmx v2
  ADA: '0xab1ae161655b7b15f692425a0ffd07395afa67d5', // rantom
  ALGO: '0x6a26b547ab55064f9b4be6df20e06f5005255815', // rantom
  DOT: '0x21c95e4d9eae57f692a3dd74d79d16ff07e27957', // rantom
  EOS: '0x6a4fc4b66aef8c7c503d82fd7f984e2429147e04', // rantom
};

export const HardcodeTokens: { [key: string]: Token } = {
  // Maker: I don't know why they make things to be complicated :(
  'erc20-ethereum-0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
    chain: 'ethereum',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    symbol: 'MKR',
    decimals: 18,
  },
  'erc20-ethereum-0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': {
    chain: 'ethereum',
    address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    symbol: 'SAI',
    decimals: 18,
  },

  // DS Tokens
  'erc20-ethereum-0x0d88ed6e74bbfd96b831231638b66c05571e824f': {
    chain: 'ethereum',
    address: '0x0d88ed6e74bbfd96b831231638b66c05571e824f',
    symbol: 'AVT',
    decimals: 18,
  },
  'erc20-ethereum-0x431ad2ff6a9c365805ebad47ee021148d6f7dbe0': {
    chain: 'ethereum',
    address: '0x431ad2ff6a9c365805ebad47ee021148d6f7dbe0',
    symbol: 'DF',
    decimals: 18,
  },
  'erc20-ethereum-0x8e0e57dcb1ce8d9091df38ec1bfc3b224529754a': {
    chain: 'ethereum',
    address: '0x8e0e57dcb1ce8d9091df38ec1bfc3b224529754a',
    symbol: 'CAH',
    decimals: 18,
  },
  'erc20-ethereum-0xcfe4eb08e33272d98cb31e37a7be78d5c1b740c1': {
    chain: 'ethereum',
    address: '0xcfe4eb08e33272d98cb31e37a7be78d5c1b740c1',
    symbol: 'VB',
    decimals: 18,
  },

  // https://etherscan.io/token/0x9469d013805bffb7d3debe5e7839237e535ec483
  'erc20-ethereum-0x9469d013805bffb7d3debe5e7839237e535ec483': {
    chain: 'ethereum',
    address: '0x9469d013805bffb7d3debe5e7839237e535ec483',
    symbol: 'RING',
    decimals: 18,
  },

  // https://etherscan.io/token/0x0000000000a39bb272e79075ade125fd351887ac
  'erc20-ethereum-0x0000000000a39bb272e79075ade125fd351887ac': {
    chain: 'ethereum',
    address: '0x0000000000a39bb272e79075ade125fd351887ac',
    symbol: 'BlurPool',
    decimals: 18,
  },

  // Euler.Finance e and d tokens
  ...EulerTokens,

  // gmxv2 index tokens
  'erc20-arbitrum-0x47904963fc8b2340414262125af798b9655e58cd': {
    chain: 'arbitrum',
    address: '0x47904963fc8b2340414262125af798b9655e58cd',
    symbol: 'BTC',
    decimals: 18,
  },
  'erc20-arbitrum-0xc4da4c24fd591125c3f47b340b6f4f76111883d8': {
    chain: 'arbitrum',
    address: '0xc4da4c24fd591125c3f47b340b6f4f76111883d8',
    symbol: 'DOGE',
    decimals: 18,
  },
  'erc20-arbitrum-0xc14e065b0067de91534e032868f5ac6ecf2c6868': {
    chain: 'arbitrum',
    address: '0xc14e065b0067de91534e032868f5ac6ecf2c6868',
    symbol: 'XRP',
    decimals: 18,
  },
  'erc20-arbitrum-0xb46a094bc4b0adbd801e14b9db95e05e28962764': {
    chain: 'arbitrum',
    address: '0xb46a094bc4b0adbd801e14b9db95e05e28962764',
    symbol: 'LTC',
    decimals: 18,
  },
};
