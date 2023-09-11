/**
 * @fileoverview Definições de rota para manipulação de execuções.
 * @module routes/execucaoRoutes
 */

import { Router } from 'express';
import { listAllResults, search } from '../controllers/resultsController';

const router = Router();

/**
 * @description Rota para obter todas as execuções.
 * @route GET /api/executions
 * @returns {Array<Object>} Array de objetos representando todas as execuções.
 */
router.get('/executions', listAllResults);

/**
 * @description Rota para executar uma pesquisa.
 * @route POST /api/execute
 * @param {Object} params - Parâmetros da pesquisa.
 * @param {string} params.query - Consulta da pesquisa.
 * @param {string} params.range_query - Consulta de faixa da pesquisa.
 * @param {string} params.extras - Parâmetros extras da pesquisa.
 * @param {string} status - Status da pesquisa.
 * @returns {Object} Objeto contendo os resultados da pesquisa.
 */
router.post('/execute', search);

export default router;
