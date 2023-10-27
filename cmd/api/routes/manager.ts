import { HttpStatusCode } from 'axios';
import { Router } from 'express';

import EnvConfig from '../../../configs/envConfig';
import { IManagerService } from '../../../services/manager/domain';
import Manager from '../../../services/manager/manager';
import { ContractConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import { writeResponse } from '../middleware';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.post('/config/contract/add', async (request, response) => {
    try {
      const { chain, address, protocol, birthblock, logFilters } = request.body as ContractConfig;

      const key = request.body.managerKey;
      if (EnvConfig.system.managerKey !== key) {
        await writeResponse(services, request, response, HttpStatusCode.Unauthorized, {
          error: 'unauthorized',
        });
      } else {
        const manager: IManagerService = new Manager(services.database);
        await manager.addContractConfig({
          chain,
          address,
          protocol,
          birthblock,
          logFilters,
        });
        await writeResponse(services, request, response, HttpStatusCode.Created, {
          error: null,
        });
      }
    } catch (e: any) {
      await writeResponse(services, request, response, HttpStatusCode.InternalServerError, {
        error: 'server error',
      });
      console.log(e);
    }
  });

  return router;
}
