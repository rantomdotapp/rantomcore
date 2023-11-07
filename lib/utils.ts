// given a raw log topics list and topic filter config
// check the match
import BigNumber from 'bignumber.js';

import { ContractLogTopics } from '../types/configs';

export function utilLogMatchFilter(log: any, filter: ContractLogTopics): boolean {
  if (filter.topic0 === log.topics[0]) {
    if (filter.topic1 && (!log.topics[1] || filter.topic1 !== log.topics[1])) {
      return false;
    }
    if (filter.topic2 && (!log.topics[2] || filter.topic2 !== log.topics[2])) {
      return false;
    }
    if (filter.topic3 && (!log.topics[3] || filter.topic3 !== log.topics[3])) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

export function formatFromDecimals(value: string, decimals: number): string {
  return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)).toString(10);
}

export function hexStringToDecimal(hexString: string): number {
  return new BigNumber(hexString, 16).toNumber();
}

// https://etherscan.io/address/0x00000000219ab540356cbb839cbe05303d7705fa#code#L169
export function fromLittleEndian64(bytes8: string): string {
  // remove 0x
  const bytes8Value = bytes8.split('0x')[1];
  let swapBytes8 = '0x';
  swapBytes8 += bytes8Value[14] + bytes8Value[15];
  swapBytes8 += bytes8Value[12] + bytes8Value[13];
  swapBytes8 += bytes8Value[10] + bytes8Value[11];
  swapBytes8 += bytes8Value[8] + bytes8Value[9];
  swapBytes8 += bytes8Value[6] + bytes8Value[7];
  swapBytes8 += bytes8Value[4] + bytes8Value[5];
  swapBytes8 += bytes8Value[2] + bytes8Value[3];
  swapBytes8 += bytes8Value[0] + bytes8Value[1];

  return new BigNumber(hexStringToDecimal(swapBytes8).toString()).dividedBy(1e9).toString(10);
}
