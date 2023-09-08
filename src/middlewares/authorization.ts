import { NextFunction, Request, Response } from "express";

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const mareHeader = req.headers['auth_token'];

    if (mareHeader && mareHeader === 'abc123') {
        // Se o cabeçalho "mare" for igual a "123", permita a solicitação passar
        next();
    } else {
        // Caso contrário, retorne um erro de autenticação
        res.status(401).json({ error: 'Autenticação falhou' });
    }
};
export default authenticationMiddleware