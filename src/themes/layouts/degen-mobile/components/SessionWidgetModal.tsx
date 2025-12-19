import React from 'react'
import SessionWidget from './SessionWidget'
import { ModalOverlay, ModalContainer, Header, Title, CloseButton, Content } from './ModalComponents'

interface Props { onClose: () => void }

const SessionWidgetModal: React.FC<Props> = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $variant="default" onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title $variant="default">🎲 Session Tracker</Title>
          <CloseButton onClick={onClose} />
        </Header>
        <Content>
          <SessionWidget />
        </Content>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default SessionWidgetModal
