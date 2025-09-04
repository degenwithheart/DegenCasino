import styled, { keyframes } from 'styled-components'

export const Wrapper = styled.div`
  max-width: 500px;
  padding: 1.1rem 1.3rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #e8f3ff;
`

export const Title = styled.h2`
  margin: 0 0 .25rem;
  font-size: 1.35rem;
  letter-spacing: .5px;
  background: linear-gradient(90deg,#ffd700,#a259ff);
  -webkit-background-clip: text;
  color: transparent;
`

export const Section = styled.div`
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const SectionHeader = styled.button<{ $open: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .55rem .75rem;
  font-size: .7rem;
  letter-spacing: .5px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0));
  position: relative;
  user-select: none;
  &:focus-visible { outline: 2px solid #6366f1aa; outline-offset: -2px; }
  &::after {
    content: '';
    width: 8px; height: 8px;
    border-right: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    transform: rotate(${p => p.$open ? '45deg' : '-45deg'});
    transition: transform .25s;
    margin-left: .65rem;
  }
`

export const SectionBody = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${p => p.$open ? '1fr' : '0fr'};
  transition: grid-template-rows .32s cubic-bezier(.4,0,.2,1);
  > div { overflow: hidden; }
`

export const SectionContentPad = styled.div`
  padding: .35rem .75rem .75rem;
  display: flex;
  flex-direction: column;
  gap: .55rem;
`

export const StaticHeader = styled.div`
  display: flex;
  align-items: center;
  padding: .55rem .75rem .25rem;
  font-size: .7rem;
  letter-spacing: .5px;
  font-weight: 600;
  color: #fff;
  user-select: none;
  background: linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0));
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px,1fr));
  gap: .4rem .65rem;
  margin: .35rem 0 .55rem;
`

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  padding: .25rem .45rem;
  border-radius: 6px;
  font-size: .52rem;
  letter-spacing: .5px;
  font-weight: 600;
  color: #d9e6f5;
  white-space: nowrap;
`

export const HorizontalScroll = styled.div`
  display: flex;
  flex-direction: row;
  gap: .75rem;
  overflow-x: auto;
  padding: .5rem .25rem .5rem .25rem;
  scrollbar-width: thin;
  scrollbar-color: #444 transparent;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
`

export const Row = styled.label`
  display: flex;
  align-items: center;
  gap: .55rem;
  font-size: .78rem;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
  padding: 2px 0;
  input { transform: scale(1.05); cursor: pointer; }
  span.badge { margin-left: auto; font-size: .55rem; background:#222; padding:2px 5px; border:1px solid #333; border-radius:5px; letter-spacing:.5px; }
`

export const LabelText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #f5f7fa;
  font-size: .68rem;
  letter-spacing: .3px;
`

export const ToggleShell = styled.button<{ $on: boolean }>`
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: 20px;
  background: ${p => p.$on ? 'linear-gradient(90deg,#4ade80,#16a34a)' : 'rgba(255,255,255,0.15)'};
  border: 1px solid ${p => p.$on ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.18)'};
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: background .25s, box-shadow .25s;
  box-shadow: ${p => p.$on ? '0 0 0 2px rgba(74,222,128,0.25)' : 'none'};
  &:focus-visible { box-shadow: 0 0 0 2px #6366f180; }
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${p => p.$on ? '16px' : '2px'};
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    transition: left .25s ease;
  }
`

export const Segmented = styled.div`
  display: inline-flex;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  overflow: hidden;
`

export const SegmentBtn = styled.button<{ $active?: boolean }>`
  font-size: .58rem;
  padding: .35rem .55rem;
  background: ${p => p.$active ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : '#cdd6e5'};
  border: none;
  cursor: pointer;
  letter-spacing: .5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  transition: background .18s, color .18s;
  &:hover { background: ${p => p.$active ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)'}; }
  &:focus-visible { outline: 2px solid #6366f1aa; outline-offset: -2px; }
  & + & { border-left: 1px solid rgba(255,255,255,0.12); }
`

export const Select = styled.select`
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: .6rem;
  padding: .35rem .5rem;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  &:focus-visible { box-shadow: 0 0 0 2px #6366f180; }
`

export const Note = styled.p`
  margin: .25rem 0 0;
  font-size: .7rem;
  opacity: .7;
`

export const ResetButton = styled.button`
  margin-top: .25rem;
  align-self: flex-start;
  background: linear-gradient(90deg,#a259ff,#ff008c);
  color: #fff;
  border: none;
  font-size: .65rem;
  letter-spacing: .5px;
  padding: .45rem .8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 0 10px #ff00cc55;
  transition: opacity .2s, transform .2s;
  &:hover { opacity:.85; transform: translateY(-2px); }
`
