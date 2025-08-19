import styled from "styled-components";

export const Container = styled.div`
  color: white;
  user-select: none;
  width: min(100vw, 420px);
  font-size: 20px;
`

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
`

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
    }
  }
`

export const Result = styled.div`
  @keyframes result-appear {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes mystical-result-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
    }
    50% {
      box-shadow: 0 0 30px rgba(251, 191, 36, 0.9);
    }
  }

  transform: translateX(-50%);
  position: absolute;
  top: -50px;
  transition: left .3s ease;

  & > div {
    animation: result-appear .25s cubic-bezier(0.18, 0.89, 0.32, 1.28), mystical-result-glow 2s ease-in-out infinite;
    transform-origin: bottom;
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.9) 100%);
    backdrop-filter: blur(50px);
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    padding: 8px 12px;
    font-weight: bold;
    width: 60px;
    text-align: center;
    color: #92400e;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }

  & > div::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px 10px 0px 10px;
    border-style: solid;
    border-color: rgba(251, 191, 36, 0.95) transparent transparent transparent;
  }
`
