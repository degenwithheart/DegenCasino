import { GambaTransaction } from 'gamba-core-v2'
import { GAMES } from './games'

export const truncateString = (s: string, startLen = 4, endLen = startLen) => s.slice(0, startLen) + '...' + s.slice(-endLen)

export const extractMetadata = (event: GambaTransaction<'GameSettled'>) => {
  console.log('extractMetadata called with event:', event)
  try {
    const metadata = event.data.metadata
    console.log('Raw metadata:', metadata)
    
    if (!metadata) {
      console.log('No metadata found')
      return {}
    }
    
    const [version, ...parts] = metadata.split(':')
    const [gameId] = parts
    console.log('extractMetadata debug:', { metadata, version, parts, gameId })
    
    const games = GAMES()
    console.log('Available games:', games.map(g => g.id))
    const game = games.find((x) => x.id === gameId)
    console.log('Found game:', game)
    
    return { game, gameId }
  } catch (error) {
    console.error('extractMetadata error:', error)
    return {}
  }
}
