import React from 'react'
import { Modal } from './Modal'
import SessionWidget from './SessionWidget'

export interface SessionWidgetModalProps {
  onClose: () => void
}

const SessionWidgetModal: React.FC<SessionWidgetModalProps> = ({ onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="🎲 Session Tracker">
      <SessionWidget />
    </Modal>
  )
}

export default SessionWidgetModal
