// get static data of Uniswap protocol: uniswapv2, uniswapv3
import fs from 'fs';

import SushiMasterchefAbi from '../configs/abi/sushi/Masterchef.json';
import { PublicSubGraphEndpoints } from '../configs/constants/subgraphEndpoints';
import SushiLibs from '../modules/adapters/sushi/libs';
import UniswapLibs from '../modules/adapters/uniswap/libs';
import BlockchainService from '../services/blockchains/blockchain';
import { LiquidityPoolConstant, StakingPoolConstant } from '../types/domains';
import { GetMasterChefPoolsOptions } from './getSushiData';

const Factories: Array<any> = [
  {
    chain: 'ethereum',
    address: '0x1097053fd2ea711dad45caccc45eff7548fcb362',
    subgraph: PublicSubGraphEndpoints.pancakeswap,
  },
  {
    chain: 'arbitrum',
    address: '0x02a84c1b3bbd7401a5f7fa98a384ebc70bb5749e',
    subgraph: PublicSubGraphEndpoints.pancakeswapArbitrum,
  },
  {
    chain: 'base',
    address: '0x02a84c1b3bbd7401a5f7fa98a384ebc70bb5749e',
    subgraph: PublicSubGraphEndpoints.pancakeswapBase,
  },
  {
    chain: 'bnbchain',
    address: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    subgraph: PublicSubGraphEndpoints.pancakeswapBnbchain,
  },
];

const v3Factories: Array<any> = [
  {
    chain: 'ethereum',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
    subgraph: PublicSubGraphEndpoints.pancakeswapv3,
  },
  {
    chain: 'arbitrum',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
    subgraph: PublicSubGraphEndpoints.pancakeswapv3Arbitrum,
  },
  {
    chain: 'base',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
    subgraph: PublicSubGraphEndpoints.pancakeswapv3Base,
  },
  {
    chain: 'bnbchain',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
    subgraph: PublicSubGraphEndpoints.pancakeswapv3Bnbchain,
  },
];

const Masterchefs: Array<any> = [
  {
    chain: 'bnbchain',
    protocol: 'pancakeswap',
    version: 'masterchef',
    address: '0x73feaa1ee314f8c655e354234017be2193c9e24e',
  },
  {
    chain: 'bnbchain',
    protocol: 'pancakeswap',
    version: 'masterchefV2',
    address: '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652',
  },
];

async function getMasterchefPools(options: GetMasterChefPoolsOptions): Promise<void> {
  let existedPools: Array<StakingPoolConstant> = [];
  let poolId = 0;
  if (fs.existsSync(options.filePath)) {
    existedPools = JSON.parse(fs.readFileSync(options.filePath).toString()) as Array<StakingPoolConstant>;
    for (const existedPool of existedPools) {
      if (existedPool.address === options.address && existedPool.poolId > poolId) {
        poolId = existedPool.poolId;
      }
    }
  }

  if (poolId > 0) {
    poolId += 1;
  }

  const allPools: Array<StakingPoolConstant> = existedPools;

  const blockchain = new BlockchainService(null);

  const poolLength = await blockchain.singlecall({
    chain: options.chain,
    abi: SushiMasterchefAbi,
    target: options.address,
    method: 'poolLength',
    params: [],
  });

  while (poolId < poolLength) {
    const poolInfo = await SushiLibs.getMasterchefPoolInfo({
      services: null,
      protocol: options.protocol,
      chain: options.chain,
      address: options.address,
      version: options.version,
      poolId,
    });
    if (poolInfo) {
      allPools.push(poolInfo);
      fs.writeFileSync(options.filePath, JSON.stringify(allPools));

      console.log(
        `Got staking pool ${options.protocol} ${options.chain} ${options.address} ${poolId} ${poolInfo.token.symbol}`,
      );
    }

    poolId++;
  }
}

(async function () {
  // get masterchef staking pools
  for (const config of Masterchefs) {
    await getMasterchefPools({
      ...config,
      filePath: './configs/data/PancakeswapStakingPools.json',
    });
  }

  let pools: Array<LiquidityPoolConstant> = [];
  for (const config of Factories) {
    console.log(`Getting top liquidity pool ${config.chain} pancakeswap ${config.subgraph}`);
    pools = pools.concat(
      await UniswapLibs.getTopLiquidityPools({
        top: 100,
        chain: config.chain,
        protocol: 'pancakeswap',
        version: 'univ2',
        factoryAddress: config.address,
        endpoint: config.subgraph,
        filters: {
          orderBy: config.chain === 'bnbchain' ? 'trackedReserveBNB' : 'totalTransactions',
        },
        httpRequestOptions: {
          referer: 'https://pancakeswap.finance/',
          origin: 'https://pancakeswap.finance',
        },
      }),
    );
  }
  fs.writeFileSync('./configs/data/PancakeswapPools.json', JSON.stringify(pools));

  let v3Pools: Array<LiquidityPoolConstant> = [];
  for (const config of v3Factories) {
    console.log(`Getting top liquidity pool ${config.chain} pancakeswapv3 ${config.subgraph}`);
    v3Pools = v3Pools.concat(
      await UniswapLibs.getTopLiquidityPools({
        top: 100,
        chain: config.chain,
        protocol: 'pancakeswapv3',
        version: 'univ3',
        factoryAddress: config.address,
        endpoint: config.subgraph,
        filters: {
          orderBy: 'txCount',
        },
      }),
    );
  }
  fs.writeFileSync('./configs/data/Pancakeswapv3Pools.json', JSON.stringify(v3Pools));
})();
