
// --- Access Window Logic ---
// Returns the next online window (start, end) for the repeating 3h online, 1h offline cycle
export function getAccessWindow(): { start: Date; end: Date } {
  const now = new Date()
  // Find the start of the current day (midnight)
  const dayStart = new Date(now)
  dayStart.setHours(0, 0, 0, 0)
  const msSinceDayStart = now.getTime() - dayStart.getTime()
  const cycleMs = 4 * 60 * 60 * 1000 // 4 hours per cycle
  const onlineMs = 4 * 60 * 60 * 1000 // 3 hours online
  const cycleNum = Math.floor(msSinceDayStart / cycleMs)
  const cycleStart = new Date(dayStart.getTime() + cycleNum * cycleMs)
  const cycleEnd = new Date(cycleStart.getTime() + onlineMs)
  // If now is in the online window, return this window; else, return the next window
  if (now >= cycleStart && now < cycleEnd) {
    return { start: cycleStart, end: cycleEnd }
  } else {
    // Next online window starts after the current cycle ends
    const nextStart = new Date(cycleStart.getTime() + cycleMs)
    const nextEnd = new Date(nextStart.getTime() + onlineMs)
    return { start: nextStart, end: nextEnd }
  }
}

// --- LocalStorage Override Logic ---
const OVERRIDE_KEY = 'access_override'
const OVERRIDE_EXPIRY_KEY = 'access_override_expiry'
const OVERRIDE_DURATION_MS = 60 * 60 * 1000 // 1 hour

export function setAccessOverride() {
  localStorage.setItem(OVERRIDE_KEY, 'true')
  localStorage.setItem(OVERRIDE_EXPIRY_KEY, (Date.now() + OVERRIDE_DURATION_MS).toString())
}

export function clearAccessOverride() {
  localStorage.removeItem(OVERRIDE_KEY)
  localStorage.removeItem(OVERRIDE_EXPIRY_KEY)
}

export function isAccessOverrideActive(): boolean {
  const active = localStorage.getItem(OVERRIDE_KEY) === 'true'
  const expiry = localStorage.getItem(OVERRIDE_EXPIRY_KEY)
  if (!active || !expiry) return false
  if (Date.now() > Number(expiry)) {
    clearAccessOverride()
    return false
  }
  return true
}



export function isWithinAccessTime(): boolean {
  if (isAccessOverrideActive()) return true
  const now = new Date()
  // Find the start of the current day (midnight)
  const dayStart = new Date(now)
  dayStart.setHours(0, 0, 0, 0)
  const msSinceDayStart = now.getTime() - dayStart.getTime()
  const cycleMs = 4 * 60 * 60 * 1000 // 4 hours per cycle
  const onlineMs = 4 * 60 * 60 * 1000 // 3 hours online
  const cycleNum = Math.floor(msSinceDayStart / cycleMs)
  const cycleStart = new Date(dayStart.getTime() + cycleNum * cycleMs)
  const cycleEnd = new Date(cycleStart.getTime() + onlineMs)
  return now >= cycleStart && now < cycleEnd
}
