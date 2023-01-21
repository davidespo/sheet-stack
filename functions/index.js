const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const db = express();

app.use(cors());
app.use(express.json());
db.use(cors());
db.use(express.json());

// my routings
const rpcRoute = require("./rpc/rpcRoutes");
const basicRoute = require("./db/basicRoutes");

// add routes to the express app.
app.use("/v1/rpc", rpcRoute);
app.use("/v1/db", basicRoute);
db.use(basicRoute);

exports.api = functions.https.onRequest(app);
exports.db = functions.https.onRequest(db);
