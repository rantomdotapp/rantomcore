import { HttpStatusCode } from 'axios';
import { Request, Response, Router } from 'express';

import { DefaultQueryResultLimit } from '../../../configs';
import EnvConfig from '../../../configs/envConfig';
import { queryBlockTimestamps } from '../../../lib/subsgraph';
import { ContextServices } from '../../../types/namespaces';
import { writeResponse } from '../middleware';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.post('/query', async (request, response) => {
    await handleQueryEvents(services, request, response);
  });

  return router;
}

async function handleQueryEvents(services: ContextServices, request: Request, response: Response) {
  const { chain, protocols, address, actions } = request.body;

  const queryChains: Array<string> = [];
  if (chain && EnvConfig.blockchains[chain]) {
    queryChains.push(chain);
  } else {
    for (const [chain] of Object.entries(EnvConfig.blockchains)) {
      queryChains.push(chain);
    }
  }

  try {
    let eventActions: Array<any> = [];
    for (const chain of queryChains) {
      const query: any = {
        chain: chain,
      };

      if (protocols) {
        query.protocol = {
          $in: protocols as Array<string>,
        };
      }
      if (address) {
        query.addresses = {
          $in: [address],
        };
      }
      if (actions) {
        query.action = {
          $in: actions as Array<string>,
        };
      }

      const documents: Array<any> = await services.database.query({
        collection: EnvConfig.mongodb.collections.actions,
        query: query,
        options: {
          limit: DefaultQueryResultLimit,
          skip: 0,
          order: { blockNumber: -1 },
        },
      });

      if (documents.length > 0) {
        const blocktimes = await queryBlockTimestamps(
          EnvConfig.blockchains[chain].blockSubgraph as string,
          documents[documents.length - 1].blockNumber,
          documents[0].blockNumber,
        );

        if (blocktimes) {
          for (const document of documents) {
            delete document._id;
            document.timestamp = blocktimes[document.blockNumber];
            eventActions.push(document);
          }
        }
      }
    }

    // sort by timestamp
    eventActions = eventActions.sort(function (a: any, b: any) {
      return a.timestamp > b.timestamp ? -1 : 1;
    });

    await writeResponse(services, request, response, HttpStatusCode.Ok, {
      error: null,
      actions: eventActions,
    });
  } catch (e: any) {
    await writeResponse(services, request, response, HttpStatusCode.InternalServerError, {
      error: 'server error',
    });
    console.log(e);
  }
}
