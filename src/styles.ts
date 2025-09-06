import styled from 'styled-components'

export const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  transition: width .25s ease, padding .25s ease;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 60px;

  /* Add bottom padding to prevent content from being hidden behind the fixed footer */
  padding-bottom: 80px;

  @media (min-width: 600px) {
    padding: 20px;
    width: 95%;
    max-width: 1000px;
  }

  @media (min-width: 1280px) {
    width: 1100px;
  }
`

export const TosWrapper = styled.div`
  position: relative;
  &:after {
    content: " ";
    background: linear-gradient(180deg, transparent, #15151f);
    height: 40px;
    pointer-events: none;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`

export const TosInner = styled.div`
  max-height: 400px;
  padding: 10px;
  overflow: auto;
  position: relative;

  @media (max-width: 600px) {
    max-height: 300px;
    padding: 6px;
    font-size: 0.9rem;
    line-height: 1.3;
  }
`
