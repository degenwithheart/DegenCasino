import React from 'react';
import { TOS_HTML } from '../../../../constants';
import {
    ModalOverlay,
    ModalContainer,
    Header,
    Title,
    CloseButton,
    Content,
    PageContent,
    ActionButton
} from '../components/ModalComponents';

interface TOSModalProps {
    onClose: () => void;
    onAccept: () => void;
}

const TOSInner: React.FC<{ onAccept: () => void; }> = ({ onAccept }) => {
    return (
        <PageContent>
            <div
                style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '1.5rem',
                    color: '#fff',
                    fontFamily: "'JetBrains Mono', 'Orbitron', 'monospace'"
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: TOS_HTML }} />

                <p style={{
                    color: '#a259ff',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    margin: '1.5rem 0 2rem',
                    lineHeight: '1.7',
                    textShadow: '0 0 8px #a259ff'
                }}>
                    By playing on our platform, you confirm your compliance.
                </p>

                <ActionButton onClick={onAccept}>
                    I UNDERSTAND & ACCEPT
                </ActionButton>
            </div>
        </PageContent>
    );
};

export const TOSContent: React.FC<{ onAccept: () => void; }> = ({ onAccept }) => (
    <TOSInner onAccept={onAccept} />
);

const TOSModal: React.FC<TOSModalProps> = ({ onClose, onAccept }) => {
    const handleAccept = () => {
        onAccept();
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer
                $variant="default"
                onClick={(e) => e.stopPropagation()}
            >
                <Header $variant="default">
                    <Title $variant="default" $icon="📜">
                        TERMS OF SERVICE
                    </Title>
                    <CloseButton $variant="default" onClick={onClose} />
                </Header>

                <Content>
                    <TOSInner onAccept={handleAccept} />
                </Content>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default TOSModal;