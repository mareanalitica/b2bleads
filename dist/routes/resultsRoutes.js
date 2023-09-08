"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// execucaoRoutes.ts
const express_1 = require("express");
const resultsController_1 = require("../controllers/resultsController");
const router = (0, express_1.Router)();
router.get('/executions', resultsController_1.listAllResults);
router.post('/execute', resultsController_1.search);
exports.default = router;
