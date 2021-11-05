<h1 align="center">
  Transferências com a FinAPI - IGNITE ROCKETSEAT
</h1>

<h4 align="center">
	Desafio para implementar uma nova funcionalidade na FinAPI, uma aplicação do curso Ignite Node.JS da RocketSeat
</h4>

<p align="center">
  <img alt="Repository size" src="https://img.shields.io/static/v1?label=Last%20commit&message=October&color=yellowgreen&style=for-the-badge&logo=Slack">
</p>

# 💻 Sobre o desafio

A nova funcionalidade deverá permitir a transferência de valores entre contas. Para isso, você pode pensar na melhor forma de construir essa solução mas alguns requisitos deverão ser cumpridos:

- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;
- O balance (obtido através da rota `/api/v1/statements/balance`) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário;
- As informações para realizar uma transferência serão:

    ```json
    {
    	"amount": 100,
    	"description": "Descrição da transferência"
    }
    ```

    Você pode passar o `id` do usuário destinatário via parâmetro na rota (exemplo: `/api/v1/statements/transfers/:user_id`) e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;

- Ao mostrar o balance de um usuário, operações do tipo `transfer` deverão possuir os seguintes campos:

    ```json
    {
      "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
    	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
      "amount": 100,
      "description": "Transferência de valor",
      "type": "transfer",
      "created_at": "2021-03-26T21:33:11.370Z",
      "updated_at": "2021-03-26T21:33:11.370Z"
    }
    ```

    Observe o campo `sender_id`. Esse deverá ser o `id` do usuário que enviou a transferência.
    O campo `type` também deverá exibir o tipo da operação, que nesse caso é `transfer`.

[Link do projeto sem as implementações][linkProject]

<!-- <p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="Test" title="#Test" src="" width="400px">

  <img alt="Test" title="#Test" src="" width="400px">
</p> -->

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js][nodejs]
- [Express][express]
- [UUID][uuid]
- [JEST][jest]
- [Tsyring][tsyring]
- [Supertest][supertest]
- [Vscode][vscode]

## 💡 Como executar o projeto

Nesse repositório está a aplicação já implementada com os teste, é necessário clonar o repositório para a sua máquina e seguir as informações abaixo:

TESTES:

```bash

  Para rodar os testes execute o comando "yarn test" ou "npm run test"

  Para rodar os testes de integração um por vez execute esse comando "yarn test --detectOpenHandles"

```

## Comando para criar o container docker com os dados para o banco da aplicação

```bash
docker run --name ignite-challenge-database-queries -e POSTGRES_DB=queries_challenge -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

## 📝 Feito por Jeandson Tenorio

👋🏽👋🏽👋🏽👋🏽 [contato!](https://www.linkedin.com/in/jeandson/)

[nodejs]: https://nodejs.org/
[express]: https://expressjs.com/pt-br/
[uuid]: https://www.npmjs.com/package/uuid
[Vscode]: https://code.visualstudio.com/
[jest]: https://jestjs.io/pt-BR/docs/getting-started
[tsyring]: https://www.npmjs.com/package/tsyringe
[supertest]: https://www.npmjs.com/package/supertest
[linkProject]: https://github.com/rocketseat-education/ignite-template-tests-challenge
