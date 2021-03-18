// @flow
import React, { useCallback, useState, useEffect } from "react";
import MockReq from "mock-req";
import MockRes from "mock-res";
import Box from "~/renderer/components/Box";
import api from "./api";
import Button from "~/renderer/components/Button";

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
        <App url={app} />
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
        Ledger Live API Sandbox
      </Button>
      <Button
        onClick={() => {
          setApp("https://machard.github.io/ll-client-demo/ethereum-dapp-browser/");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Ledger Live Ethereum Dapp browser
      </Button>
      <Button
        onClick={() => {
          setApp(
            "https://machard.github.io/ll-client-demo/ethereum-dapp-browser/?app=https://app.aave.com",
          );
        }}
        primary
      >
        Aave
      </Button>
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

export default Apps;
