// given a raw log topics list and topic filter config
// check the match
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
