import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg,#070708,#0f0f10);
  color: white;
  padding: 24px;
`;

const Card = styled.div`
  max-width: 900px;
  width: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  text-align: center;
`;

const Title = styled.h1`
  color: #ff6666;
  margin-bottom: 12px;
  font-size: 2.2rem;
`;

const Message = styled.p`
  color: #ddd;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const Note = styled.div`
  margin-top: 18px;
  color: #bbb;
  font-size: 0.9rem;
`;

const BackSoon: React.FC = () => {
  const env = (import.meta as any).env || {};
  const accessMessage = env.VITE_ACCESS_OVERRIDE_MESSAGE || 'Access is currently restricted. Please check back later!';
  const offlineMessage = env.VITE_OFFLINE_MESSAGE || 'We are catching our breath, back soon.';

  return (
    <Wrap>
      <Card>
        <Title>We'll be back soon</Title>
        <Message>{accessMessage}</Message>
        <Message style={{ marginTop: 12, fontStyle: 'italic' }}>{offlineMessage}</Message>
        <Note>
          If you are an admin, visit <a href="/admin" style={{ color: '#fff', textDecoration: 'underline' }}>Admin</a> to manage override settings.
        </Note>
      </Card>
    </Wrap>
  );
};

export default BackSoon;
