const express = require("express");
const app = express();
const jsonFile = require("./pokemon2.json");

app.use(express.json());

let min = 0;
let limit = 20;
let max = limit;

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res) => {
  const filters = req.query;
  let filteredJSon = JSON.parse(JSON.stringify(jsonFile));

  if (filters.id != undefined) {
    filteredJSon.data = jsonFile.data.filter(
      (poke) => poke.PokedexNumber == filters.id
    );
  }

  if (filters.name != undefined) {
    filteredJSon.data = filteredJSon.data.filter((poke) =>
      poke.Name.includes(filters.name)
    );
  }
  if (filters.type != undefined) {
    filteredJSon.data = filteredJSon.data.filter(
      (poke) => poke.Types == filters.type
    );
  }
  if (filters.min != undefined && filters.max != undefined) {
    min = filters.min;
    max = filters.max;
  } else {
    min = 0;
    max = limit;
  }
  filteredJSon.total = filteredJSon.data.length;
  filteredJSon.data = filteredJSon.data.slice(min, max);
  res.json(filteredJSon);
});

app.listen(8000);
