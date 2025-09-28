import { GambaTransaction } from 'gamba-core-v2'
import { GAMES } from './games'

export const truncateString = (s: string, startLen = 4, endLen = startLen) => s.slice(0, startLen) + '...' + s.slice(-endLen)

export const extractMetadata = (event: GambaTransaction<'GameSettled'>) => {
  try {
    const metadata = event.data.metadata as any
    
    if (!metadata) {
      return {}
    }
    
    let gameId = ''
    
    if (typeof metadata === 'string') {
      // Handle string format: "0:gameId:extra"
      const [version, ...parts] = metadata.split(':')
      gameId = parts[0] || ''
    } else if (Array.isArray(metadata)) {
      // Handle array format: ['0', 'gameId', ...extra] or old format [mineCount, currentLevel, cellIndex]
      if (metadata.length >= 2 && typeof metadata[1] === 'string') {
        gameId = metadata[1]
      } else if (metadata.length === 3 && metadata.every((item: any) => typeof item === 'number')) {
        // Old Mines format: [mineCount, currentLevel, cellIndex] - assume it's mines
        gameId = 'mines'
      }
    }
    
    const games = GAMES()
    const game = games.find((x) => x.id === gameId)
    
    return { game, gameId }
  } catch (error) {
    console.error('extractMetadata error:', error)
    return {}
  }
}
