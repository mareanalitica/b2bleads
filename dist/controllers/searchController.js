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
exports.search = exports.getAllQueryes = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const getAllQueryes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queries = yield prisma.search.findMany();
        res.json(queries);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pesquisas.' });
    }
});
exports.getAllQueryes = getAllQueryes;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, status } = req.body;
    try {
        // Realizar a pesquisa na casa dos dados e cadastrar os resultados previos
        const { query, range_query, extras } = params;
        let totalPages = 1;
        let sumOfItems = 0;
        let results = [];
        for (let actualPage = 1; actualPage <= totalPages; actualPage++) {
            const postData = {
                query, range_query, extras, page: actualPage
            };
            const response = yield axios_1.default.post("https://api.casadosdados.com.br/v2/public/cnpj/search", postData, {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "marehub/1.0"
                }
            });
            const minedData = response.data;
            const { count, cnpj } = minedData.data;
            if (actualPage === 1) {
                console.log(`===================== Página: ${actualPage} - PESQUISA =====================`);
                console.log("[Adicionando]", count);
                sumOfItems = count;
            }
            if (cnpj.length > 0)
                results.push(...cnpj);
        }
        const pesquisa = yield prisma.search.create({
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
                yield prisma.document.create({
                    data: {
                        cnpj: document.cnpj,
                        razao: document.razao_social,
                        searchId: pesquisa.id
                    }
                });
            }
            catch (error) {
                console.log(`${document.cnpj} da ${document.razao_social}, ja está cadastrado no Banco.`);
                continue;
            }
        }
        res.status(201).json({ total: sumOfItems, results });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Algo deu errado ao criar pesquisa.' });
    }
});
exports.search = search;
