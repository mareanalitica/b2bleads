import { Request, Response, Router } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

router.get('/export/:id', async (req: Request, res: Response) => {
    try {
        const pesquisaId = req.params.id;

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

        const results = search.documents;

        // Define o cabeçalho do arquivo CSV
        const csvHeader = [
            { id: 'cnpj', title: 'CNPJ' },
            { id: 'phone', title: 'Telefones' },
            { id: 'email', title: 'Email' },
            { id: 'razao', title: 'Razao Social' },
        ];

        const csvWriter = createObjectCsvWriter({
            path: `${pesquisaId}_exported_data.csv`,
            header: csvHeader,
        });

        await csvWriter.writeRecords(results);

        res.download(`${pesquisaId}_exported_data.csv`, `${pesquisaId}_exported_data.csv`, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo CSV como resposta:', err);
                res.status(500).json({ error: 'Erro ao exportar pesquisa.' });
            } else {
                // Apaga o arquivo CSV após o envio
                fs.unlink(`${pesquisaId}_exported_data.csv`, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Erro ao apagar o arquivo CSV:', unlinkErr);
                    } else {
                        console.log('Arquivo CSV apagado com sucesso.');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Erro ao exportar pesquisa:', error);
        res.status(500).json({ error: 'Algo deu errado ao exportar pesquisa.' });
    }
});

export default router;
