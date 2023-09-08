// execucaoRoutes.ts
import { Router } from 'express';
import { listAllResults, search } from '../controllers/resultsController';

const router = Router();

router.get('/executions', listAllResults);
router.post('/execute', search);

export default router;
