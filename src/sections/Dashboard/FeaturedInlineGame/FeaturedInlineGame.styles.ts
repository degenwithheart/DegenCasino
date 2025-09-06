import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 600px) {
    max-width: 900px;
    padding: 24px 24px;
  }
  @media (min-width: 1000px) {
    max-width: 1100px;
    padding: 32px 32px;
  }
  @media (max-width: 767px) {
    width: 100vw;
    max-width: 100vw;
    padding: 8px 0;
    margin: 0 auto;
    box-sizing: border-box;
    overflow-x: hidden;
  }
`
