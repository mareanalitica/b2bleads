import { NextFunction, Request, Response } from "express";
const apiToken = process.env.API_TOKEN
const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const mareHeader = req.headers['auth_token'];

    if (mareHeader && mareHeader === apiToken) {
        next();
    } else {
        // Caso contrário, retorne um erro de autenticação
        res.status(401).json({ error: 'Autenticação falhou' });
    }
};
export default authenticationMiddleware