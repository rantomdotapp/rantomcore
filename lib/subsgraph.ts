import axios from 'axios';

import logger from './logger';

export async function querySubgraph(endpoint: string, query: string, options: any = {}): Promise<any> {
  try {
    const response = await axios.post(
      endpoint,
      {
        query: query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...options,
        },
        validateStatus: (status: number) => true,
      },
    );

    if (response.data.errors) {
      logger.warn('failed to query subgraph', {
        service: 'subgraph',
        endpoint: endpoint,
      });
      console.error(response.data.errors);
      return null;
    }

    return response.data.data ? response.data.data : null;
  } catch (e: any) {
    logger.warn('failed to query subgraph', {
      service: 'subgraph',
      endpoint: endpoint,
      error: e.message,
    });
    return null;
  }
}
