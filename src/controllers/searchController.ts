// pesquisaController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export const removeAllQueryes = async (req: Request, res: Response) => {
    try {
        await prisma.search.deleteMany({});
        res.json({ sucess: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pesquisas.' });
    }
};
export const getAllQueryes = async (req: Request, res: Response) => {
    try {
        const queries = await prisma.search.findMany();
        res.json(queries);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pesquisas.' });
    }
};
export interface Company {
    cnpj: string;
    razao_social: string
}
export const search = async (req: Request, res: Response) => {
    const { params, status } = req.body;
    try {
        const {
            query, range_query, extras
        } = params
        let totalPages = 5;
        let sumOfItems = 0;
        let results: Company[] = [];
        for (let actualPage = 1; actualPage <= totalPages; actualPage++) {
            const postData = {
                query, range_query, extras, page: actualPage
            }
            const response = await axios.post(
                "https://api.casadosdados.com.br/v2/public/cnpj/search",
                postData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "marehub/1.0"
                    }
                }
            );
            const minedData = response.data;
            const { count, cnpj } = minedData.data;
            totalPages = Math.ceil(count / 20);
            if (actualPage === 1) {
                console.log(`===================== Página: ${actualPage} - PESQUISA =====================`)
                console.log("[Adicionando]", count);
                sumOfItems = count
                if (totalPages >= 50) {
                    console.log("Melhore seu filtro, ou ative a opção por estado")
                    totalPages = 50
                }
            }
            if (cnpj !== undefined) {
                if (cnpj.length > 0) results.push(...cnpj)
            }
        }
        const pesquisa = await prisma.search.create({
            data: {
                params: JSON.stringify(params),
                status,
                date: new Date().toISOString(),
                total: sumOfItems,
            },
        });
        // webhook
        for (let index = 0; index < results.length; index++) {
            const document = results[index];
            try {
                await prisma.document.create({
                    data: {
                        cnpj: document.cnpj,
                        razao: document.razao_social,
                        searchId: pesquisa.id
                    }
                })
            } catch (error) {
                console.log(`${document.cnpj} da ${document.razao_social}, ja está cadastrado no Banco.`)
                continue
            }
        }
        res.status(201).json({ total: sumOfItems, results });
    } catch (error) {
        console.log(error)

        res.status(500).json({ error: 'Algo deu errado ao criar pesquisa.' });
    }
};
