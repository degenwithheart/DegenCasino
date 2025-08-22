import { GambaTransaction } from 'gamba-core-v2'
import { GAMES } from './games'

export const truncateString = (s: string, startLen = 4, endLen = startLen) => s.slice(0, startLen) + '...' + s.slice(-endLen)

export const extractMetadata = (event: GambaTransaction<'GameSettled'>) => {
  try {
    const [version, ...parts] = event.data.metadata.split(':')
    const [gameId] = parts
    console.log('extractMetadata debug:', { metadata: event.data.metadata, version, parts, gameId })
    const games = GAMES()
    const game = games.find((x) => x.id === gameId)
    console.log('Found game:', game, 'Available games:', games.map(g => g.id))
    return { game, gameId }
  } catch (error) {
    console.error('extractMetadata error:', error)
    return {}
  }
}
