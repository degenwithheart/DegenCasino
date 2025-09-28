import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../ColorSchemeContext'

// Footer is hidden on mobile theme, but we need the component for consistency
const FooterContainer = styled.footer`
  display: none; /* Hidden on mobile theme */
`

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return <FooterContainer />
}

export default Footer