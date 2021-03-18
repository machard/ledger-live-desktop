// @flow
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SelectAccount from "~/renderer/components/SelectAccount";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

const Body = ({ onClose, data }) => {
  const accounts = useSelector(shallowAccountsSelector);
  const [account, setAccount] = useState(accounts[0]);

  return (
    <ModalBody
      onClose={() => {
        if (data.onApiEnd) {
          return data.onApiEnd("closed");
        }
        onClose();
      }}
      title={"Select Account"}
      render={() => <SelectAccount onChange={setAccount} value={account} />}
      renderFooter={() => (
        <Box horizontal justifyContent="flex-end">
          <Button
            onClick={() => {
              if (data.onApiEnd) {
                return data.onApiEnd(null, account);
              }
              onClose();
            }}
            primary
          >
            Continue
          </Button>
        </Box>
      )}
    />
);
}

export default Body;
