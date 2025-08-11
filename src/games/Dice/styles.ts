import styled from 'styled-components';

export const Container = styled.div`
  color: white;
  user-select: none;
  width: 50vw;
  font-size: 20px;
  backdrop-filter: blur(15px);
  padding: 20px;
  border-radius: 15px;
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  & > div {
    padding: 20px;
    text-align: center;
    div:last-child {
      font-size: 14px;
    }
  }
`;

export const RollUnder = styled.div`
  display: flex;
  color: white;
  margin-bottom: 20px;

  & > div {
    margin: 0 auto;
    border-radius: 10px;
    text-align: center;
    & > div:first-child {
      font-weight: bold;
      font-size: 64px;
      font-variant-numeric: tabular-nums;
      transition: transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), color 0.2s;
      cursor: pointer;
      &:hover {
        transform: scale(1.08) rotate(-2deg);
        color: #ff949f;
      }
    }
  }
`;

export const Result = styled.div`
  @keyframes result-appear {
    0% {
      opacity: 0;
      transform: scale(0.6) translateY(20px);
    }
    60% {
      opacity: 1;
      transform: scale(1.1) translateY(-8px);
    }
    80% {
      transform: scale(0.95) translateY(2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  transform: translateX(-50%);
  position: absolute;
  top: -50px;
  transition: left .3s cubic-bezier(0.18, 0.89, 0.32, 1.28);

  & > div {
    animation: result-appear .45s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    transform-origin: bottom;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 5px;
    padding: 5px;
    font-weight: bold;
    width: 50px;
    text-align: center;
    color: black;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  & > div::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px 10px 0px 10px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.6) transparent transparent transparent;
  }
`;
