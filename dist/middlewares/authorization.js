"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationMiddleware = (req, res, next) => {
    const mareHeader = req.headers['auth_token'];
    if (mareHeader && mareHeader === 'abc123') {
        // Se o cabeçalho "mare" for igual a "123", permita a solicitação passar
        next();
    }
    else {
        // Caso contrário, retorne um erro de autenticação
        res.status(401).json({ error: 'Autenticação falhou' });
    }
};
exports.default = authenticationMiddleware;
