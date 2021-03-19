// @flow
import React, { useCallback, useState, useEffect } from "react";
import { remote } from "electron";
import MockReq from "mock-req";
import MockRes from "mock-res";
import path from "path";
import { useSelector } from "react-redux";
import { parseCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import IPCTransportHost from "./ipctransporthost";
import WalletConnectCore from "@walletconnect/core";
import * as cryptoLib from "@walletconnect/iso-crypto";
import Box from "~/renderer/components/Box";
import api from "./api";
import SelectAccount from "~/renderer/components/SelectAccount";
import Button from "~/renderer/components/Button";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import store from "~/renderer/store";
import { openModal, closeModal } from "~/renderer/actions/modals";
import { BigNumber } from "bignumber.js";

const filter = account => account.currency.id === "ethereum";

const Apps = (props) => {
  const [app, setApp] = useState();

  if (app) {
    return (
      <Box grow>
        <Button
          onClick={() => {
            setApp();
          }}
          primary
          style={{ marginBottom: 10 }}
        >
          Back
        </Button>
        {app === "aavehack" ? (
          <AaveHack />
        ) : app === "inprogress" ? (
          <Box>In Progress</Box>
        ) : (
          <App url={app} />
        )}
      </Box>
    );
  }

  return (
    <Box grow>
      <Button
        onClick={() => {
          setApp("https://machard.github.io/ll-client-demo/api-sandbox/");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Ledger Live API Sandbox (iframe, nothing injected, ledger-live-client included by the app)
      </Button>
      <Button
        onClick={() => {
          setApp("https://machard.github.io/ll-client-demo/ethereum-dapp-demo/");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Ledger Live Ethereum standalone Dapp Demo (iframe, nothing injected, ledge-live-client + ledger-live-web3-provider included by the app)
      </Button>
      <Button
        onClick={() => {
          setApp("inprogress");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Aave (iframe, ledge-live-client + ledger-live-web3-provider injected)
      </Button>
      <Button
        onClick={() => {
          setApp("aavehack");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Aave (webview, injected wallet-connect-web3-provider hacked to use ipc transport instead of websocket bridge)
      </Button>
      {/*<Button
        onClick={() => {
          setApp("https://machard.github.io/ll-client-demo/ethereum-dapp-browser/");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Ledger Live Ethereum Dapp browser
      </Button>*/}
    </Box>
  );
};

// Props are passed from the <Route /> component in <Default />
const App = ({ url }) => {
  const [iFrame, setIFrame] = useState();

  useEffect(() => {
    if (!iFrame) {
      return;
    }
    const handler = message => {
      console.log("handlerrr", message.data);
      if (message.data.from !== "LedgerLiveClient") {
        return;
      }
      const req = new MockReq({
        method: message.data.params.method || "GET",
        url: message.data.url,
        headers: message.data.params.headers,
      });
      req.body = message.data.params.body ? JSON.parse(message.data.params.body) : null;
      req.end();
      const res = {
        setHeader: () => {},
        json: ({ status, body }) => {
          iFrame.contentWindow.postMessage(
            {
              body,
              status,
              id: message.data.id,
              from: "LedgerLive",
            },
            "*",
          );
        },
      };
      api(req, res);
    };
    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [iFrame]);

  const ref = useCallback(ref => {
    setIFrame(ref);
  }, []);
  return (
    <Box grow>
      <iframe
        ref={ref}
        src={url}
        style={{
          flex: 1,
        }}
      />
    </Box>
  );
};

const AaveHack = () => {
  const accounts = useSelector(shallowAccountsSelector);
  const [account, setAccount] = useState(accounts.filter(filter)[0]);
  const [connector, setConnector] = useState();

  const onChangeAccount = useCallback(
    account => {
      // $FlowFixMe
      setAccount(account);
      if (connector && connector.connected) {
        connector.updateSession({
          // $FlowFixMe
          accounts: [account.freshAddress],
          chainId: 1,
        });
      }
    },
    [connector],
  );

  const setUp = useCallback(
    (uri, webview) => {
      let session;
      const sessionStorage = {
        getSession: () => {
          return session;
        },
        setSession: s => {
          session = s;
          return session;
        },
        removeSession: () => {
          session = null;
        },
      };

      const connector = new WalletConnectCore({
        cryptoLib,
        connectorOpts: {
          uri,
          clientMeta: {
            description: "LedgerLive",
            url: "https://ledger.fr",
            icons: ["https://cdn.live.ledger.com/live/icon-512.png"],
            name: "LedgerLive",
          },
        },
        transport: new IPCTransportHost({ webview }),
        sessionStorage,
      });
      connector.on("session_request", (error, payload) => {
        if (error) {
          return;
        }
        console.log("session_request");
        connector.approveSession({
          accounts: [account.freshAddress],
          chainId: 1,
        });
      });
      connector.on("call_request", (error, payload) => {
        if (error) {
          return;
        }

        switch (payload.method) {
          case "eth_sendTransaction":
            store.dispatch(
              openModal("MODAL_SEND", {
                recipient: payload.params[0].to,
                amount: BigNumber(payload.params[0].value),
                account,
                onApiEnd: (_, res) => {
                  store.dispatch(closeModal("MODAL_SEND"));
                  connector.rejectRequest({
                    id: payload.id,
                    error: {
                      message: "HELLLOOO not implemented",
                    },
                  });
                },
              }),
            );
            break;
          default:
            remote.dialog.showMessageBoxSync({
              message: JSON.stringify(payload),
            });
            connector.rejectRequest({
              id: payload.id,
              error: {
                message: "SALUT SALUT, not implemented",
              },
            });
            break;
        }
      });
      setConnector(connector);
    },
    [account],
  );

  const ref = useCallback(
    webview => {
      if (webview !== null) {
        const setupHandler = evt => {
          const {
            args: [uri],
            channel,
          } = evt;
          console.log(evt);
          if (channel !== "dappuri") {
            return;
          }
          setUp(uri, webview);
        };
        // $FlowFixMe
        webview.addEventListener("ipc-message", setupHandler);
      }
    },
    [setUp],
  );

  const preload = __DEV__
    ? path.join(process.env.PWD || "", ".webpack", "provider.bundle.js")
    : path.join(__dirname, "provider.bundle.js");

  return (
    <Box grow>
      <SelectAccount onChange={onChangeAccount} value={account} filter={filter} />
      <webview
        ref={ref}
        // Your source
        id="webview"
        src="https://app.aave.com"
        preload={`file://${preload}`}
        style={{
          flex: 1,
          marginTop: 10,
        }}
      />
    </Box>
  );
};

export default Apps;
