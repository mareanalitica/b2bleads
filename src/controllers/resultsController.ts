import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { load } from 'cheerio';
import queue from 'queue';

const prisma = new PrismaClient();
const q = new queue({ concurrency: 1, timeout: 5000 });

export const listAllResults = async (req: Request, res: Response) => {
  try {
    const executions = await prisma.document.findMany();
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar execuções.' });
  }
};
function convertToJSON(cssSelector: any, elements: any) {
  const result: any = {};

  for (let i = 0; i < elements.length; i++) {
    const element = cssSelector(elements[i]);
    const keyElement = element.children('.has-text-weight-bold');
    const valueElements = element.children().slice(1);

    const key = keyElement.text().trim();
    const values = valueElements
      .map((index: any, el: any) => cssSelector(el).text().trim())
      .get();
    if (values.length === 1) {
      result[key] = values[0];
    } else {
      result[key] = values;
    }
  }

  return result;
}
function convertPhoneNumbers(phones: any) {
  if (Array.isArray(phones)) {
    return phones.map((phone) => parseInt(phone.replace(/\D/g, ''), 10));
  } else if (typeof phones === 'string') {
    return [parseInt(phones.replace(/\D/g, ''), 10)];
  }
  return [];
}
export const search = async (req: Request, res: Response) => {
  try {
    const pendingExecution = await prisma.search.findFirst({
      where: {
        status: 'pending',
      },
      include: {
        documents: true,
      },
    });

    if (!pendingExecution) {
      return res.status(404).json({ message: 'Nenhuma pesquisa pendente encontrada.' });
    }

    const { documents } = pendingExecution;



    documents.forEach((document: any) => {
      q.push(async (cb: any) => {
        const identifier = document.id;
        const formatedRazaoSocial = document.razao.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
        const formatedCnpj = document.cnpj.replace(/\D/g, '');
        const url = `https://casadosdados.com.br/solucao/cnpj/${formatedRazaoSocial}-${formatedCnpj}`;

        try {
          const dResponse = await axios.post(url, null, {
            headers: {
              'User-Agent': `demomarehub${identifier}`,
            },
          });

          if (dResponse.data !== null) {
            const detailsData = await dResponse.data;
            const multiCssSelector = load(detailsData);
            const narrowElements = multiCssSelector('.is-narrow');

            const jsonResult = convertToJSON(multiCssSelector, narrowElements);
            const dados = {
              cnpj: jsonResult.CNPJ,
              phones: convertPhoneNumbers(jsonResult.Telefone),
              emails: jsonResult['E-MAIL'],
            };
            console.log(dados);

            // Atualize o documento aqui usando o Prisma

            cb(); // Marca a tarefa como concluída na fila
          }
        } catch (error) {
          console.log("[ERRO]", error);
          cb(error); // Marca a tarefa como concluída com erro na fila
        }
      })
    });

    // Aguarde o término de todas as tarefas na fila
    q.start((err: any) => {
      if (err) {
        console.error("[ERRO NA FILA]", err);
        // return res.status(500).json({ error: 'Erro ao criar execução.' });
      }
      // Atualize a pesquisa para sucesso aqui
      return res.status(200).json({ message: 'Pesquisa concluída com sucesso.' });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao criar execução.' });
  }
};

