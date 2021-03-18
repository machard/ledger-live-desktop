// @flow
import React, { useCallback, useState, useEffect } from "react";
import type { RouterHistory, Match, Location } from "react-router-dom";
import MockReq from "mock-req";
import MockRes from "mock-res";
import Box from "~/renderer/components/Box";
import api from "./api";
import Button from "~/renderer/components/Button";

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

const Apps = (props) => {
  const [app, setApp] = useState();

  if (app === "sandbox") {
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
        <Doc {...props} />
      </Box>
    );
  }

  if (app === "ethereumDapp") {
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
        <Dapp {...props} />
      </Box>
    );
  }

  return (
    <Box grow>
      <Button
        onClick={() => {
          setApp("sandbox");
        }}
        primary
        style={{ marginBottom: 10 }}
      >
        Ledger Live API Sandbox
      </Button>
      <Button
        onClick={() => {
          setApp("ethereumDapp");
        }}
        primary
      >
        Ledger Live Ethereum Dapp browser
      </Button>
    </Box>
  );
};

// Props are passed from the <Route /> component in <Default />
const Doc = ({ history, location, match }: Props) => {
  const [iFrame, setIFrame] = useState();

  useEffect(() => {
    if (!iFrame) {
      return;
    }
    const handler = message => {
      console.log("handlerrr", message);
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
        src="https://machard.github.io/ll-client-demo/"
        style={{
          flex: 1,
        }}
      />
    </Box>
  );
};

// Props are passed from the <Route /> component in <Default />
const Dapp = ({ history, location, match }: Props) => {
  return <Box grow>In progress</Box>;
};
export default Apps;
