<img alt="Ignite" src="https://user-images.githubusercontent.com/17517028/170498895-f1db725e-fdfd-4de2-8518-10ff8392a33a.png" />

<h3 align="center">
  Desafio 01 - Conceitos do Node.js - Tasklist
</h3>

<p align="center">
  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">
</p>


# 💻 Sobre o desafio

Nesse desafio, você deverá criar uma aplicação para treinar o que aprendeu até agora no Node.js!

Essa será uma aplicação de listagem e cadastro de usuários. Para que a listagem de usuários funcione, o usuário que solicita a listagem deve ser um admin (mais detalhes ao longo da descrição).

## Rotas da aplicação

### POST `/users`

A rota deve receber `name`, e `email` dentro do corpo da requisição para que seja possível cadastrar um usuário.

### PATCH `/users/:user_id/admin`

A rota deve receber, nos parâmetros da rota, o `id` de um usuário e transformar esse usuário em admin.

### GET `/users/:user_id`

A rota deve receber, nos parâmetros da rota, o `id` de um usuário e devolver as informações do usuário encontrado pelo corpo da resposta.

### GET `/users`

A rota deve receber, pelo header da requisição, uma propriedade `user_id` contendo o `id` do usuário e retornar uma lista com todos os usuários cadastrados. O `id` deverá ser usado para validar se o usuário que está solicitando a listagem é um admin. O retorno da lista deve ser feito apenas se o usuário for admin.

## Específicação dos testes

Para que o desafio seja considerado como válido, todos os testes unitários da aplicação deverão passar com sucesso. Para executar os testes, execute o comando:

```bash
# yarn test
```

## Documentação

Além de implementar as rotas da aplicação, você também deve construir a documentação da API utilizando a lib SwaggerUI.

### Swagger

Para saber mais sobre o Swagger, acesse a documentação oficial no site [swagger.io/resources/open-api](https://swagger.io/resources/open-api/).

### GET `/api-docs`

Endpoint para consulta da documentação.

![image](https://user-images.githubusercontent.com/17517028/171058596-4c5fab09-23df-4c39-99c8-9400956fefa1.png)

