import { HttpStatusCode } from 'axios';
import { Router } from 'express';

import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress } from '../../../lib/helper';
import { ContextServices } from '../../../types/namespaces';
import { writeResponse } from '../middleware';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.get('/:chain/:address', async (request, response) => {
    try {
      const { chain, address } = request.params;

      const logs: Array<any> = await services.database.query({
        collection: EnvConfig.mongodb.collections.rawlogs,
        query: {
          chain,
          address: normalizeAddress(address),
        },
        options: {
          limit: 100,
          skip: 0,
          order: { blockNumber: -1 },
        },
      });

      const returnLogs: Array<any> = [];
      for (const log of logs) {
        delete log._id;
        returnLogs.push(log);
      }

      await writeResponse(services, request, response, HttpStatusCode.Created, {
        error: null,
        data: returnLogs,
      });
    } catch (e: any) {
      await writeResponse(services, request, response, HttpStatusCode.InternalServerError, {
        error: 'server error',
      });
      console.log(e);
    }
  });

  return router;
}
