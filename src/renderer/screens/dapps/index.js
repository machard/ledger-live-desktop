// @flow
import React, { useCallback, useState, useEffect } from "react";
import type { RouterHistory, Match, Location } from "react-router-dom";
import MockReq from "mock-req";
import MockRes from "mock-res";
import Box from "~/renderer/components/Box";
import api from "./api";

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

// Props are passed from the <Route /> component in <Default />
const Dapps = ({ history, location, match }: Props) => {
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
      if (message.data.body) {
        req.write(JSON.parse(message.data.body));
      }
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
export default Dapps;
