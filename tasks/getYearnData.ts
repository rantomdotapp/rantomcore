// get static data of Yearn vaults
import axios from 'axios';
import fs from 'fs';

import YearnStableSwapPoolAbi from '../configs/abi/yearn/YearnStableswapPool.json';
import { AddressZero } from '../configs/constants/addresses';
import { compareAddress, normalizeAddress } from '../lib/utils';
import YearnLibs from '../modules/adapters/yearn/libs';
import BlockchainService from '../services/blockchains/blockchain';
import { LiquidityPoolConstant, StakingPoolConstant } from '../types/domains';

const YearnExporterEndpoints = [
  'ethereum:::https://api.yexporter.io/v1/chains/1/vaults/all',
  'arbitrum:::https://api.yexporter.io/v1/chains/42161/vaults/all',
  'optimism:::https://api.yexporter.io/v1/chains/10/vaults/all',
  'base:::https://api.yexporter.io/v1/chains/8453/vaults/all',
];

const YearnyethLiquidityPool = '0x2cced4ffa804adbe1269cdfc22d7904471abde63';

(async function () {
  const blockchain = new BlockchainService(null);

  const yearnyethLiquidityPool: LiquidityPoolConstant = {
    protocol: 'yearnyeth',
    chain: 'ethereum',
    version: 'stableswap',
    factory: AddressZero,
    address: normalizeAddress(YearnyethLiquidityPool),
    tokens: [],
  };

  // get yearn yETH assets from liquidity pool
  const numAsset = await blockchain.singlecall({
    chain: 'ethereum',
    abi: YearnStableSwapPoolAbi,
    target: YearnyethLiquidityPool,
    method: 'num_assets',
    params: [],
  });
  for (let poolId = 0; poolId < Number(numAsset); poolId++) {
    const asset = await blockchain.singlecall({
      chain: 'ethereum',
      abi: YearnStableSwapPoolAbi,
      target: YearnyethLiquidityPool,
      method: 'assets',
      params: [poolId],
    });
    const token = await blockchain.getTokenInfo({
      chain: 'ethereum',
      address: asset,
    });
    if (token) {
      yearnyethLiquidityPool.tokens.push(token);
      console.log(`Got yearnyeth liquidity pool asset ${poolId} ${token.symbol}`);
    }
  }

  fs.writeFileSync('./configs/data/YearnyethLiquidityPools.json', JSON.stringify([yearnyethLiquidityPool]));

  const stakingPoolFilePath = './configs/data/YearnVaults.json';
  for (const config of YearnExporterEndpoints) {
    let existedVaults: Array<StakingPoolConstant> = [];
    if (fs.existsSync(stakingPoolFilePath)) {
      existedVaults = JSON.parse(fs.readFileSync(stakingPoolFilePath).toString());
    }
    const [chain, endpoint] = config.split(':::');
    const response = await axios.get(endpoint);

    const vaults: Array<any> = (response.data as Array<any>).filter((item: any) => item.type === 'v2');

    for (const vault of vaults) {
      if (
        existedVaults.filter((item) => item.chain === chain && compareAddress(item.address, vault.address)).length === 0
      ) {
        const vaultInfo = await YearnLibs.getVaultInfo({
          services: null,
          chain: chain,
          protocol: 'yearn',
          address: vault.address,
        });
        if (vaultInfo) {
          existedVaults.push(vaultInfo);
          fs.writeFileSync(stakingPoolFilePath, JSON.stringify(existedVaults));

          console.log(`Got yearn vault ${chain} ${vault.address} ${vaultInfo.token.symbol}`);
        }
      }
    }
  }
})();
