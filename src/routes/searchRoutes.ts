import { Router } from 'express';
import { getAllQueryes, search } from '../controllers/searchController';

const router = Router();

router.get('/search', getAllQueryes);
router.post('/search', search);

export default router;
