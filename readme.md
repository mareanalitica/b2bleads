# Aplicativo de Mineração de Dados Abertos
![image](https://github.com/mareanalitica/b2bleads/assets/125692232/37325190-50ce-48e2-a0b1-5abfcf438a5d)

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

- [Postman](https://documenter.getpostman.com/view/29644412/2s9YC1YEqD)


## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e enviar solicitações de pull (pull requests) para melhorar este projeto.

## Licença
Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

---
