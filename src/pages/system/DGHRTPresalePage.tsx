// Default DGHRTPresalePage.tsx - Basic presale interface
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const PresaleContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`

const PresaleContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`

const PresaleTitle = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 2rem;
`

const PresaleDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const PriceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 400px;
  
  .price {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2563eb;
    margin: 1rem 0;
  }
  
  .description {
    color: #666;
    margin-bottom: 2rem;
  }
`

const PresaleButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #1d4ed8;
  }
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .description {
    color: #666;
    line-height: 1.6;
  }
`

const DGHRTPresalePage: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const features = [
    {
      icon: '🚀',
      title: 'Early Access',
      description: 'Be among the first to acquire DGHRT tokens at exclusive presale pricing.'
    },
    {
      icon: '💰',
      title: 'Bonus Rewards',
      description: 'Receive 25% bonus tokens for investments during the presale period.'
    },
    {
      icon: '🏆',
      title: 'VIP Status',
      description: 'Presale investors gain permanent VIP status with special privileges.'
    },
    {
      icon: '🎯',
      title: 'Guaranteed Allocation',
      description: 'Secure your token allocation now before public sale sells out.'
    }
  ]

  return (
    <PresaleContainer>
      <PresaleContent>
        <PresaleTitle>DGHRT Token Presale</PresaleTitle>
        
        <PresaleDescription>
          Join the exclusive presale of DGHRT tokens and become a founding member of our casino ecosystem. 
          Secure your position with special presale pricing and exclusive benefits.
        </PresaleDescription>
        
        <PriceCard>
          <h3>Presale Price</h3>
          <div className="price">$0.08</div>
          <div className="description">
            25% discount from public launch price of $0.10<br/>
            Limited time offer - First 1,000,000 tokens only
          </div>
          <PresaleButton>Join Presale</PresaleButton>
        </PriceCard>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <div className="icon">{feature.icon}</div>
              <div className="title">{feature.title}</div>
              <div className="description">{feature.description}</div>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PresaleContent>
    </PresaleContainer>
  )
}

export default DGHRTPresalePage