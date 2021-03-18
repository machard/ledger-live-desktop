// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const ReleaseNotesModal = () => (
  <Modal
    name="MODAL_SELECT_ACCOUNT"
    centered
    render={({ data, onClose }) => <Body onClose={onClose} data={data} />}
  />
);

export default ReleaseNotesModal;
