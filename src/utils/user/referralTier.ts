import { REFERRAL_TIERS, REFERRAL_TIERS_FINANCIAL_MODE, PLATFORM_REFERRAL_FEE } from '../../constants'

export type ReferralTier = typeof REFERRAL_TIERS[number]

export interface ReferralTierInfo {
  currentTier: number // The tier number (1, 2, 3, 4)
  nextTier?: number
  progress: number // 0-1, progress to next tier
  currentFee: number // Actual fee (fixed in badge mode, tiered in financial mode)
  displayFee: number // Fee shown in UI (always tiered for aspirational display)
  nextFee?: number
  currentTierData: ReferralTier
  nextTierData?: ReferralTier
  isFinancialMode: boolean
}

/**
 * Get the current referral fee based on the number of referrals
 * In badge mode: always returns PLATFORM_REFERRAL_FEE (0.25%)
 * In financial mode: returns tiered fee
 */
export function getReferralFee(refCount: number): number {
  if (!REFERRAL_TIERS_FINANCIAL_MODE) {
    return PLATFORM_REFERRAL_FEE // Fixed 0.25% for everyone in badge mode
  }
  
  let fee: number = REFERRAL_TIERS[0].fee
  for (const tier of REFERRAL_TIERS) {
    if (refCount >= tier.min) fee = tier.fee
  }
  return fee
}

/**
 * Get the display fee (always shows tiered progression for motivation)
 */
export function getDisplayFee(refCount: number): number {
  let fee: number = REFERRAL_TIERS[0].fee
  for (const tier of REFERRAL_TIERS) {
    if (refCount >= tier.min) fee = tier.fee
  }
  return fee
}

/**
 * Get comprehensive tier information for a given referral count
 */
export function getReferralTierInfo(refCount: number): ReferralTierInfo {
  let currentTierData: ReferralTier = REFERRAL_TIERS[0]
  let nextTierData: ReferralTier | undefined
  let currentTierIndex = 0
  
  // Find current tier
  for (let i = 0; i < REFERRAL_TIERS.length; i++) {
    if (refCount >= REFERRAL_TIERS[i].min) {
      currentTierData = REFERRAL_TIERS[i]
      currentTierIndex = i
      nextTierData = REFERRAL_TIERS[i + 1]
    }
  }
  
  // Calculate progress to next tier
  let progress = 1 // Default to 100% if at max tier
  if (nextTierData) {
    const current = refCount - currentTierData.min
    const required = nextTierData.min - currentTierData.min
    progress = Math.min(current / required, 1)
  }
  
  return {
    currentTier: currentTierIndex + 1, // 1-based tier numbering
    nextTier: nextTierData ? currentTierIndex + 2 : undefined,
    progress,
    currentFee: getReferralFee(refCount), // Actual fee paid
    displayFee: getDisplayFee(refCount), // Fee shown in UI
    nextFee: nextTierData?.fee,
    currentTierData,
    nextTierData,
    isFinancialMode: REFERRAL_TIERS_FINANCIAL_MODE,
  }
}

/**
 * Format fee as percentage string with mode context
 */
export function formatFeePercentage(fee: number, showModeInfo: boolean = false): string {
  const percentage = `${(fee * 100).toFixed(2)}%`
  
  if (showModeInfo && !REFERRAL_TIERS_FINANCIAL_MODE) {
    return `${percentage} (Badge Tier)` // Clarify it's badge mode
  }
  
  return percentage
}

/**
 * Format tier display with badge
 */
export function formatTierDisplay(tierInfo: ReferralTierInfo): string {
  const { currentTierData, isFinancialMode } = tierInfo
  const badge = currentTierData.badge
  const name = currentTierData.name
  
  if (isFinancialMode) {
    return `${badge} ${name} • ${formatFeePercentage(tierInfo.currentFee)} per bet`
  } else {
    return `${badge} ${name} Badge • ${formatFeePercentage(tierInfo.displayFee)} target`
  }
}

/**
 * Get referrals needed for next tier
 */
export function getReferralsToNextTier(refCount: number): number {
  const tierInfo = getReferralTierInfo(refCount)
  if (!tierInfo.nextTierData) return 0
  return tierInfo.nextTierData.min - refCount
}
