import React from 'react'
import styled from 'styled-components'
import { useCurrentPool } from 'gamba-react-ui-v2'
import { TokenValue } from 'gamba-react-ui-v2'
import { PLATFORM_CREATOR_ADDRESS, EXPLORER_URL } from '../constants'

const Container = styled.div`
  margin-top: 1rem;
`

const Title = styled.h4`
  margin: 0 0 12px 0;
  color: #ffd700;
  font-size: 1rem;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.04);
`

const Left = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
`

const Player = styled.div`
  font-family: monospace;
  color: #ffb86b;
`

const Time = styled.div`
  color: #aaa;
  font-size: 12px;
`

const ExplorerLink = styled.a`
  color: #8ab4ff;
  text-decoration: none;
  font-size: 13px;
`

function shortAddr(addr?: string) {
  if (!addr) return 'unknown'
  return addr.slice(0,6) + '...' + addr.slice(-4)
}

export const PoolWinners: React.FC = () => {
  const pool = useCurrentPool()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [winners, setWinners] = React.useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    const API = 'https://api.gamba.so/events/settledGames'

  const candidateIds: string[] = []
  try { if (pool?.authority?.toBase58) candidateIds.push(pool.authority.toBase58()) } catch {}
  try { if (pool?.publicKey?.toBase58) candidateIds.push(pool.publicKey.toBase58()) } catch {}
  try { if (pool?.token?.toBase58) candidateIds.push(pool.token.toBase58()) } catch {}

  // Dedupe and normalize lower-case
  const uniqCandidates = Array.from(new Set(candidateIds)).map(s => `${s}`.toLowerCase())

    // The public API supports filtering by creator (platform). There's no
    // documented `pool=` query parameter, so fetch plays for the platform and
    // filter locally for plays that reference the pool.
    // Paginated fetch: the API returns pages. Try several pages until we
    // accumulate enough plays or run out. itemsPerPage=200 is a reasonable
    // tradeoff; stop after maxPages to avoid infinite loops.
    const fetchPlatformPlays = async (maxPages = 10) => {
      let all: any[] = []
      const perPage = 200
      for (let page = 0; page < maxPages; page++) {
        const q = `${API}?creator=${PLATFORM_CREATOR_ADDRESS.toString()}&itemsPerPage=${perPage}&page=${page}`
        try {
          const res = await fetch(q)
          if (!res.ok) break
          const json = await res.json()
          const results = json?.results || json || []
          if (!Array.isArray(results) || results.length === 0) break
          all = all.concat(results)
          // If fewer than perPage returned, no more pages
          if (results.length < perPage) break
          // Continue to next page otherwise
        } catch (e) {
          console.warn('Platform plays fetch failed on page', page, e)
          break
        }
      }
      return all
    }

    const normalizeJackpot = (play: any) => {
      // Try different possible fields
      const raw = play.jackpot || play.jackpot_payout_to_user || play.jackpotPayoutToUser || play.jackpotPayout || play.jackpot_amount || 0
      let val = parseFloat(raw || 0)
      if (isNaN(val)) val = 0
      // If value looks like lamports (very large), divide by 1e9
      if (val > 1000) val = val / 1e9
      return val
    }

    const matchesPool = (play: any, candidate?: string) => {
      if (!candidate) return true // no candidate means platform-wide
      const c = `${candidate}`.toLowerCase()

      const candidateFields = [
        play.pool, play.pool_authority, play.poolAuthority, play.poolAddress, play.poolAddress?.toString(),
        play.poolAddressString, play.pda, play.poolPubkey, play.pool_pubkey,
        play.metadata, play.metadata?.join && play.metadata.join(':'), play.creator,
        play.creatorAddress, play.creator_pubkey, play.creatorAddressString
      ].filter(Boolean)

      for (const f of candidateFields) {
        try {
          if (typeof f === 'string' && f.toLowerCase().includes(c)) return true
          if (Array.isArray(f) && f.some((x: any) => `${x}`.toLowerCase().includes(c))) return true
          // If field is object with toString
          if (f && typeof f.toString === 'function' && `${f.toString()}`.toLowerCase().includes(c)) return true
        } catch (e) {
          // ignore
        }
      }
      return false
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      let found: any[] = []

      // Fetch recent plays for the platform and filter locally.
      const platformData: any = await fetchPlatformPlays()
      if (!platformData) {
        if (mounted) setError('Failed to fetch plays')
        setLoading(false)
        return
      }
      const plays = Array.isArray(platformData) ? platformData : (platformData.results || [])

  // Debug: show what candidates we will match against
  console.debug('[PoolWinners] candidateIds', uniqCandidates, 'playsFetched', plays.length)

      // Filter plays for jackpot payouts and pool matches.
      const filtered = plays.filter((p: any) => {
        const jackpot = normalizeJackpot(p)
        if (jackpot <= 0) return false
        if (candidateIds.length === 0) return true
  return uniqCandidates.some(cand => matchesPool(p, cand))
      })

      // Sort newest first by available timestamp fields
      filtered.sort((a: any, b: any) => {
        const ta = (a.block_time || a.time || a.timestamp || a.created_at || 0)
        const tb = (b.block_time || b.time || b.timestamp || b.created_at || 0)
        return (tb - ta)
      })

      console.debug('[PoolWinners] winnersFound', filtered.length)

      if (mounted) setWinners(filtered.slice(0, 50).map((p: any) => ({...p, jackpotAmount: normalizeJackpot(p)})))
      setLoading(false)
    }

    load()

    return () => { mounted = false }
  }, [pool?.authority?.toBase58?.(), pool?.publicKey?.toBase58?.(), pool?.token?.toBase58?.(), pool?.token])

  if (loading) return (
    <Container>
      <Title>Previous Jackpot Winners</Title>
      <div style={{ color: '#aaa' }}>Loading winners…</div>
    </Container>
  )

  if (error) return (
    <Container>
      <Title>Previous Jackpot Winners</Title>
      <div style={{ color: '#ef4444' }}>{error}</div>
    </Container>
  )

  return (
    <Container>
      <Title>Previous Jackpot Winners</Title>
      {winners.length === 0 ? (
        <div style={{ color: '#aaa' }}>
          No recent jackpot winners found for this pool.
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {/* Debug hints for developers */}
            <div>Debug: check console for candidateIds and plays fetched.</div>
          </div>
        </div>
      ) : (
        <List>
          {winners.map((w, i) => (
            <Item key={w.signature || i}>
              <Left>
                <div>
                  <Player>{shortAddr(w.user || w.player || w.address)}</Player>
                  <Time>{new Date((w.block_time || w.time || w.timestamp || Date.now()) * ( (w.block_time||w.time||w.timestamp) && (w.block_time||w.time||w.timestamp) < 1e12 ? 1000 : 1 )).toLocaleString()}</Time>
                </div>
              </Left>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ minWidth: 110 }}>
                  {/* TokenValue expects amount in token units; API often returns amount in token decimals already */}
                  <TokenValue amount={w.jackpotAmount || 0} mint={w.token ? undefined : undefined} />
                </div>
                <ExplorerLink href={`${EXPLORER_URL}/explorer/transaction/${w.signature || w.id || ''}`} target="_blank" rel="noreferrer">view</ExplorerLink>
              </div>
            </Item>
          ))}
        </List>
      )}
    </Container>
  )
}

export default PoolWinners
