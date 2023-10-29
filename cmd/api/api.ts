import { Router } from 'express';

import { ContextServices } from '../../types/namespaces';
import { middleware } from './middleware';
import * as managerRouter from './routes/manager';
import * as parserRouter from './routes/parser';
import * as rawlogsRouter from './routes/rawlogs';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.use('/', middleware);

  // require authentication
  router.use('/manager', managerRouter.getRouter(services));

  // public
  router.use('/parser', parserRouter.getRouter(services));
  router.use('/rawlogs', rawlogsRouter.getRouter(services));

  return router;
}

export default getRouter;
