// @flow
import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { RouterHistory, Match, Location } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import TrackPage from "~/renderer/analytics/TrackPage";
import IconLock from "~/renderer/icons/Lock";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from "../settings/SettingsSection";
import _ from "lodash";

type Props = {
  names: *,
  error: *,
  onAddPassword: Function,
};

// Props are passed from the <Route /> component in <Default />
const Password = ({ ...props }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onAddPassword = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // TODO: Modal release notes
      dispatch(openModal("MODAL_PASSWORD_ADD_PASSWORD", { onAddPassword: props.onAddPassword }));
    },
    [dispatch, props.onAddPassword],
  );

  return (
    <>
      <Box pb={4} selectable>
        <Box
          ff="Inter|SemiBold"
          color="palette.text.shade100"
          fontSize={7}
          mb={5}
          data-e2e="password_title"
          justifyContent="space-between"
          horizontal
        >
          {t("llpassword.title")}
          <Button event="Add" small primary onClick={onAddPassword}>
            {t("llpassword.add")}
          </Button>
        </Box>
        <Section>
          <TrackPage category="Password" name="Index" />

          <Header
            icon={<IconLock size={16} />}
            title={t("llpassword.title")}
            desc={t("llpassword.desc")}
          />

          <Body>
            {_.map(props.names, (name: string) => (
              <Row title={name} desc={`Your password is secure!`}>
                <Button event="Copy passwd" small primary onClick={() => {}}>
                  {t("llpassword.copy")}
                </Button>
              </Row>
            ))}
            {props.error ? (
              <Row
                title={props.error.title || "Error"}
                desc={props.error.title || props.error.message}
              />
            ) : null}
            {!(props.names || []).length ? (
              <Row title="No Password" desc="Add a password first" />
            ) : null}
          </Body>
        </Section>
      </Box>
    </>
  );
};
export default Password;