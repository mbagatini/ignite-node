## Desafio 03

# Find A Friend API

### Sobre o desafio

Nesse desafio foi desenvolvida uma API para a adoção de animais, a Find A Friend API, utilizando SOLID e testes.

### Regras da aplicação

[x] Deve ser possível cadastrar um pet
[ ] Deve ser possível listar todos os pets disponíveis para adoção em uma cidade
[ ] Deve ser possível filtrar pets por suas características
[x] Deve ser possível visualizar detalhes de um pet para adoção
[x] Deve ser possível se cadastrar como uma ORG
[x] Deve ser possível realizar login como uma ORG

### Regras de negócio

[x] Para cadastrar um pet, a ORG precisa estar logada
[ ] Para listar os pets, obrigatoriamente precisamos informar a cidade
[x] Uma ORG precisa ter um endereço e um número de WhatsApp
[x] Um pet deve estar ligado a uma ORG
[ ] O usuário que quer adotar, entrará em contato com a ORG via WhatsApp
[ ] Todos os filtros, além da cidade, são opcionais
[x] Para uma ORG acessar a aplicação como admin, ela precisa estar logada

### Contexto da aplicação

É comum ao estar desenvolvendo uma API, imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile.

Por isso, deixamos abaixo o link para o layout da aplicação que utilizaria essa API.

[Find A Friend](https://www.figma.com/community/file/1220006040435238030)

### Instalando o projeto

#### Instalando as dependências

```bash
npm install
```

#### Preparando o ambiente

Duplique o arquivo `.env.example` e renomeie para `.env`. Preencha as variáveis de acordo com o seu ambiente.

O projeto foi preparado para utilização do Docker. Para criar e inicializar os serviços, execute o comando abaixo:

```bash
docker-compose up -d
```

#### Banco de dados

Para criar as tabelas do banco de dados, execute o comando abaixo:

```bash
npx prisma migrate dev
```

### Executando o projeto

Para iniciar a aplicação, execute o comando abaixo:

```bash
npm run dev
```

#### Executando os testes

Testes unitários:
```bash
npm run test
```

Testes end to end:
```bash
npm run pretest:e2e
npm run test:e2e
```
