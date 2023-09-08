# Aplicativo de Mineração de Dados Abertos

## Descrição
Este projeto é um aplicativo de mineração de dados que permite realizar pesquisas em fontes de dados públicas e armazenar os resultados em um banco de dados. O aplicativo utiliza o Node.js e o Express como framework web para criar uma API que aceita consultas e retorna resultados de pesquisa.

## Pré-requisitos
Antes de começar, você precisa ter o seguinte instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v14.15.3 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
- [Git](https://git-scm.com/)
- [Pm2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

## Instalação
1. Clone este repositório para sua máquina local usando o Git:
   ```shell
   git clone https://github.com/mareanalitica/b2bleads.git
   ```
2. Navegue até o diretório do projeto:
   ```shell
   cd b2bleads
   ```
3. Instale as dependências do projeto usando o npm:
   ```shell
   npm install
   ```

## Configuração
Antes de iniciar o aplicativo, você precisa configurar as variáveis de ambiente. Crie um arquivo `.env` no diretório raiz do projeto e defina as variáveis necessárias, como a porta em que o aplicativo será executado.

Exemplo de arquivo `.env`:
```
DATABASE_URL="file:./dev.db"
```

## Uso
Para iniciar o aplicativo, execute o seguinte comando na raiz do projeto:
```shell
npm start
```

O aplicativo estará acessível em `http://localhost:4200` (ou na porta configurada).

## Rotas da API
- `/api/search` (GET): Retorna todas as pesquisas realizadas.
- `/api/search` (POST): Realiza uma pesquisa de dados abertos e armazena os resultados no banco de dados.
  
  - Exemplo de corpo da solicitação:
  ```json
  {
    "params": {
      "query": {
        "termo": [],
        "atividade_principal": [],
        "natureza_juridica": [],
        "uf": ["SP"],
        "municipio": [],
        "situacao_cadastral": "ATIVA",
        "cep": [],
        "ddd": []
      },
      "range_query": {
        "data_abertura": {
            "lte": null,
            "gte": null
        },
        "capital_social": {
            "lte": "10000",
            "gte": "10000"
        }
      },
      "extras": {
        "somente_mei": false,
        "excluir_mei": false,
        "com_email": false,
        "incluir_atividade_secundaria": false,
        "com_contato_telefonico": false,
        "somente_fixo": false,
        "somente_celular": false,
        "somente_matriz": false,
        "somente_filial": false
      }
    },
    "status": "pending"
  }
  ```

- `/api/results/executions` (GET): Retorna todas as execuções de pesquisa armazenadas no banco de dados.
- `/api/results/execute` (POST): Realiza uma execução de pesquisa pendente, obtém detalhes adicionais dos resultados e atualiza o status para "success".

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e enviar solicitações de pull (pull requests) para melhorar este projeto.

## Licença
Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

---