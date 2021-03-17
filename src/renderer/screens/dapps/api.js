import express from "express";
import spec from "./doc.json";
import store from "~/renderer/store";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";

const app = express();

app.get("/spec.json", (req, res) => {
  console.log("coucou", res);
  res.json({ status: 200, body: spec });
});

app.get("/v0.0.1/accounts", (req, res) => {
  console.log("COUCOU");
  res.json({ status: 200, body: shallowAccountsSelector(store.getState()) });
});

export default app;
