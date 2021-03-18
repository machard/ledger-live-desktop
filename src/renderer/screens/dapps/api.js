import express from "express";
import spec from "./doc.json";
import store from "~/renderer/store";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { openModal, closeModal } from "~/renderer/actions/modals";
import { parseCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

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

app.post("/v0.0.1/transaction", (req, res) => {
  try {
    const accounts = shallowAccountsSelector(store.getState());
    const account = accounts.find(account => account.id === req.body.accountId);
    store.dispatch(
      openModal("MODAL_SEND", {
        recipient: req.body.recipient,
        amount: parseCurrencyUnit(account.currency.units[0], req.body.amount),
        account,
        onApiEnd: (err, account) => {
          store.dispatch(closeModal("MODAL_SEND"));
          if (err) {
            return res.json({ status: 400, body: { err } });
          }
          res.json({ status: 200, body: account });
        },
      }),
    );
  } catch (e) {
    res.json({ status: 500, body: { err: e.message } });
  }
});

export default app;
