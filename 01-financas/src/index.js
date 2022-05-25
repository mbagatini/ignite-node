const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

const StatementType = {
  INCOME: "income",
  OUTCOME: "outcome",
};

/**
 * Functions
 */
function getBalance(statements) {
  const balance = statements.reduce((acc, statement) => {
    if (statement.type === StatementType.INCOME) {
      return acc + statement.amount;
    }

    return acc - statement.amount;
  }, 0);

  return balance;
}

/**
 * Middlewares
 */
function checkCustomerExists(req, res, next) {
  const { cpf } = req.headers;
  const customer = customers.find((c) => c.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: "Customer not found" });
  }

  req.customer = customer;

  return next();
}

/**
 * Routes
 */
app.post("/account", (req, res) => {
  const { name, cpf } = req.body;

  const customerAlreadyExists = customers.find((c) => c.cpf === cpf);

  if (customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  const account = {
    id: uuid(),
    name,
    cpf,
    statements: [],
  };

  customers.push(account);

  return res.status(201).send();
});

app.post("/deposit", checkCustomerExists, (req, res) => {
  const { amount, description } = req.body;
  const { customer } = req;

  const statement = {
    type: StatementType.INCOME,
    date: new Date(),
    description,
    amount,
  };

  customer.statements.push(statement);

  customers[customer] = customer;

  return res.status(201).send();
});

app.post("/withdraw", checkCustomerExists, (req, res) => {
  const { amount, description } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statements);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  const statement = {
    type: StatementType.OUTCOME,
    date: new Date(),
    description,
    amount,
  };

  customer.statements.push(statement);

  customers[customer] = customer;

  return res.status(201).send();
});

app.put("/account", checkCustomerExists, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  customers[customer] = customer;

  return res.status(200).send();
});

app.delete("/account", checkCustomerExists, (req, res) => {
  const { customer } = req;

  customers.splice(customers.indexOf(customer), 1);

  return res.status(204).send();
});

app.get("/accounts", (req, res) => {
  return res.json({ customers: customers });
});

app.get("/statement", checkCustomerExists, (req, res) => {
  const { customer } = req;
  return res.json({ statements: customer.statements });
});

app.get("/statement/date", checkCustomerExists, (req, res) => {
  const { date } = req.query;
  const { customer } = req;
  const dateFormat = new Date(date + " 00:00");

  const statements = customer.statements.filter((statement) => {
    return statement.date.toDateString() === dateFormat.toDateString();
  });

  return res.json({ statements });
});

app.get("/balance", checkCustomerExists, (req, res) => {
	const { customer } = req;
	const balance = getBalance(customer.statements);
	return res.json({ balance: balance });
  });

app.listen(3333, () => {
  console.log("🌐 Server started on port 3333");
});
