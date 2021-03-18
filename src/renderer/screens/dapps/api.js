import express from "express";
import spec from "./doc.json";
import store from "~/renderer/store";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { openModal, closeModal } from "~/renderer/actions/modals";

const app = express();

app.get("/spec.json", (req, res) => {
  res.json({ status: 200, body: spec });
});

app.get("/v0.0.1/accounts", (req, res) => {
  res.json({ status: 200, body: shallowAccountsSelector(store.getState()) });
});

app.get("/v0.0.1/account", (req, res) => {
  store.dispatch(
    openModal("MODAL_SELECT_ACCOUNT", {
      onApiEnd: (err, account) => {
        store.dispatch(closeModal("MODAL_SELECT_ACCOUNT"));
        if (err) {
          return res.json({ status: 400, body: { err } });
        }
        res.json({ status: 200, body: account });
      },
    }),
  );
});

export default app;
