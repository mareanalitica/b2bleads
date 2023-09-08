"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.listAllResults = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const prisma = new client_1.PrismaClient();
const listAllResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const executions = yield prisma.document.findMany();
        res.json(executions);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar execuções.' });
    }
});
exports.listAllResults = listAllResults;
function convertToJSON(cssSelector, elements) {
    const result = {};
    for (let i = 0; i < elements.length; i++) {
        const element = cssSelector(elements[i]);
        const keyElement = element.children('.has-text-weight-bold');
        const valueElements = element.children().slice(1);
        const key = keyElement.text().trim();
        const values = valueElements
            .map((index, el) => cssSelector(el).text().trim())
            .get();
        if (values.length === 1) {
            result[key] = values[0];
        }
        else {
            result[key] = values;
        }
    }
    return result;
}
function convertPhoneNumbers(phones) {
    if (Array.isArray(phones)) {
        return phones.map((phone) => parseInt(phone.replace(/\D/g, ''), 10));
    }
    else if (typeof phones === 'string') {
        return [parseInt(phones.replace(/\D/g, ''), 10)];
    }
    return [];
}
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingExecution = yield prisma.search.findFirst({
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
        // Pesquisar detalhes
        const { documents } = pendingExecution;
        documents.forEach((document) => __awaiter(void 0, void 0, void 0, function* () {
            const identifier = document.id;
            // Remove espaços e caracteres especiais da razão social e transforma em letras minúsculas
            const formatedRazaoSocial = document.razao.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
            // Remove caracteres não numéricos do CNPJ
            const formatedCnpj = document.cnpj.replace(/\D/g, '');
            // Forma a URL completa
            const url = `https://casadosdados.com.br/solucao/cnpj/${formatedRazaoSocial}-${formatedCnpj}`;
            try {
                const dResponse = yield axios_1.default.post(url, null, {
                    headers: {
                        'User-Agent': `demomarehub${identifier}`,
                    },
                });
                if (dResponse.data !== null) {
                    const detailsData = yield dResponse.data;
                    const multiCssSelector = (0, cheerio_1.load)(detailsData);
                    const narrowElements = multiCssSelector('.is-narrow');
                    // Convertendo os elementos em formato JSON
                    const jsonResult = convertToJSON(multiCssSelector, narrowElements);
                    const dados = {
                        cnpj: jsonResult.CNPJ,
                        phones: convertPhoneNumbers(jsonResult.Telefone),
                        emails: jsonResult['E-MAIL'],
                    };
                    yield prisma.document.update({
                        where: {
                            id: identifier
                        },
                        data: {
                            phone: JSON.stringify(dados.phones),
                            email: dados.emails
                        }
                    });
                }
            }
            catch (error) {
                console.log("[ERRO]", error);
            }
        }));
        // Atualizar a pesquisa para sucesso
        const updatedResult = yield prisma.search.update({
            where: {
                id: pendingExecution.id
            },
            data: {
                status: 'success'
            }
        });
        return res.status(200).json(updatedResult);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao criar execução.' });
    }
});
exports.search = search;
