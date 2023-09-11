import { Request, Response, Router } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

/**
 * @description Rota para exportar uma pesquisa com base no ID recebido via query parameter.
 * @route GET /api/export/:id
 * @returns {Object} CSV contendo os resultados da pesquisa.
 */
router.get('/export/:id', async (req: Request, res: Response) => {
    try {
        // Acesse o ID da pesquisa a partir do query parameter
        const pesquisaId = req.params.id;

        // Busque os dados da pesquisa com base no ID da consulta
        const search = await prisma.search.findUnique({
            where: {
                id: Number(pesquisaId),
            },
            include: {
                documents: true,
            },
        });

        if (!search) {
            return res.status(404).json({ error: 'Pesquisa não encontrada.' });
        }

        // Extraia os resultados da pesquisa
        const results = search.documents;
        results.forEach((result: any) => {
            if (result.phones && Array.isArray(JSON.parse(result.phones)) && result.phones.length > 0) {
                result.phones = [result.phones[0]]; // Deixa apenas o índice 0
            }
        });

        // Define o cabeçalho do arquivo CSV com base na estrutura dos resultados
        const csvHeader = [
            { id: 'cnpj', title: 'CNPJ' },
            { id: 'phone', title: 'Telefones' },
            { id: 'email', title: 'Email' },
            { id: 'razao', title: 'Razao Social' },
        ];

        // Cria um objeto CSV writer com as opções desejadas
        const csvWriter = createObjectCsvWriter({
            path: `${pesquisaId}_exported_data.csv`, // Nome do arquivo CSV
            header: csvHeader,
        });

        // Escreve os resultados no arquivo CSV
        csvWriter.writeRecords(results)
            .then(() => {
                console.log('Arquivo CSV exportado com sucesso.');


                // Envie o arquivo CSV como resposta para download
                res.download(`${pesquisaId}_exported_data.csv`, `${pesquisaId}_exported_data.csv`, (err) => {
                    if (err) {
                        console.error('Erro ao enviar o arquivo CSV como resposta:', err);
                        res.status(500).json({ error: 'Erro ao exportar pesquisa.' });
                    }
                    // Apaga o arquivo CSV após o envio
                    fs.unlink(`${pesquisaId}_exported_data.csv`, (err) => {
                        if (err) {
                            console.error('Erro ao apagar o arquivo CSV:', err);
                        } else {
                            console.log('Arquivo CSV apagado com sucesso.');
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('Erro ao escrever registros no arquivo CSV:', error);
                res.status(500).json({ error: 'Erro ao exportar pesquisa.' });
            });
    } catch (error) {
        console.error('Erro ao exportar pesquisa:', error);
        res.status(500).json({ error: 'Algo deu errado ao exportar pesquisa.' });
    }
});

export default router;
