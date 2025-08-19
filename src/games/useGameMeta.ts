import { useMemo } from 'react'
import { ALL_GAMES } from './allGames'

export function useGameMeta(id: string) {
  return useMemo(() => ALL_GAMES.find(g => g.id === id)?.meta, [id])
}
