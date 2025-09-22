import styled from 'styled-components';

// UserProfile-specific components that don't have unified equivalents
export const AvatarContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #2a2a4a;
  background-color: #0f0f23;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

export const DefaultAvatar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #0f0f23;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2a2a4a;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;