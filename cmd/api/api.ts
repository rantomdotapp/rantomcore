import { Router } from 'express';

import { ContextServices } from '../../types/namespaces';
import { middleware } from './middleware';
import * as managerRouter from './routes/manager';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.use('/', middleware);

  // require authentication
  router.use('/manager', managerRouter.getRouter(services));

  return router;
}

export default getRouter;
