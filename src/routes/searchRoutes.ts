/**
 * @fileoverview Definições de rota para manipulação de pesquisas.
 * @module routes/searchRoutes
 */

import { Router } from 'express';
import { getAllQueryes, search } from '../controllers/searchController';

const router = Router();

/**
 * @description Rota para obter todas as pesquisas.
 * @route GET /api/search
 * @returns {Array<Object>} Array de objetos representando todas as pesquisas.
 */
router.get('/search', getAllQueryes);

/**
 * @description Rota para executar uma pesquisa.
 * @route POST /api/search
 * @param {Object} params - Parâmetros da pesquisa.
 * @param {string} params.query - Consulta da pesquisa.
 * @param {string} params.range_query - Consulta de faixa da pesquisa.
 * @param {string} params.extras - Parâmetros extras da pesquisa.
 * @param {string} status - Status da pesquisa.
 * @returns {Object} Objeto contendo os resultados da pesquisa.
 */
router.post('/search', search);

export default router;
