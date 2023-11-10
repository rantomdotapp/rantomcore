import { ContractConfig, ProtocolConfig } from '../../types/configs';
import { StakingPoolConstant } from '../../types/domains';

export interface YearnConfig extends ProtocolConfig {
  staking: Array<StakingPoolConstant>;
}

const YearnVeYFIContract: ContractConfig = {
  chain: 'ethereum',
  protocol: 'yearn',
  address: '0x90c1f9220d90d3966fbee24045edd73e1d588ad5', // veFYI
};

export const YearnConfigs: YearnConfig = {
  protocol: 'yearn',
  contracts: [YearnVeYFIContract],
  staking: [
    {
      chain: YearnVeYFIContract.chain,
      protocol: YearnVeYFIContract.protocol,
      address: YearnVeYFIContract.address,
      token: {
        chain: 'ethereum',
        symbol: 'YFI',
        decimals: 18,
        address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
      },
      poolId: 0, // don't care
    },
  ],
};

export const YearnyethConfig: ProtocolConfig = {
  protocol: 'yearnyeth',
  contracts: [
    {
      chain: 'ethereum',
      protocol: 'yearnyeth',
      address: '0x2cced4ffa804adbe1269cdfc22d7904471abde63', // Liquidity Pool
    },
    {
      chain: 'ethereum',
      protocol: 'yearnyeth',
      address: '0x583019ff0f430721ada9cfb4fac8f06ca104d0b4', // yETH Staking
    },
  ],
};
