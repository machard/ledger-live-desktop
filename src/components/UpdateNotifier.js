// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getUpdateStatus, getUpdateData } from 'reducers/update'
import { sendEvent } from 'renderer/events'
import type { State } from 'reducers'
import type { UpdateStatus } from 'reducers/update'

import { radii } from 'styles/theme'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { T } from 'types/common'

type Props = {
  t: T,
  updateStatus: UpdateStatus,
}

const mapStateToProps = (state: State) => ({
  updateStatus: getUpdateStatus(state),
  updateData: getUpdateData(state),
})

const Container = styled(Box).attrs({
  py: 1,
  px: 3,
  bg: 'wallet',
  color: 'white',
  style: p => ({
    transform: `translate3d(0, ${p.offset}%, 0)`,
  }),
})`
  border-radius: ${radii[1]}px;
`

class UpdateNotifier extends PureComponent<Props> {
  renderStatus() {
    const { updateStatus, t } = this.props
    switch (updateStatus) {
      case 'idle':
      case 'checking':
      case 'unavailable':
      case 'error':
      case 'available':
      case 'progress':
        return null
      case 'downloaded':
        return (
          <Box horizontal flow={2}>
            <Text fontWeight="bold">{t('update:newVersionReady')}</Text>
            <Box ml="auto">
              <Text
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => sendEvent('msg', 'updater.quitAndInstall')}
              >
                {t('update:relaunch')}
              </Text>
            </Box>
          </Box>
        )
      default:
        return null
    }
  }

  render() {
    const { updateStatus, ...props } = this.props

    const isToggled = updateStatus === 'downloaded'

    if (!isToggled) {
      return null
    }
    return <Container {...props}>{this.renderStatus()}</Container>
  }
}

export default compose(connect(mapStateToProps, null), translate())(UpdateNotifier)
