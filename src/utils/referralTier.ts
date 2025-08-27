import { REFERRAL_TIERS } from '../constants'

export type ReferralTier = typeof REFERRAL_TIERS[number]

export interface ReferralTierInfo {
  currentTier: number // The tier number (1, 2, 3, 4)
  nextTier?: number
  progress: number // 0-1, progress to next tier
  currentFee: number
  nextFee?: number
  currentTierData: ReferralTier
  nextTierData?: ReferralTier
}

/**
 * Get the current referral fee based on the number of referrals
 */
export function getReferralFee(refCount: number): number {
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
    currentFee: currentTierData.fee,
    nextFee: nextTierData?.fee,
    currentTierData,
    nextTierData,
  }
}

/**
 * Format fee as percentage string
 */
export function formatFeePercentage(fee: number): string {
  return `${(fee * 100).toFixed(2)}%`
}

/**
 * Get referrals needed for next tier
 */
export function getReferralsToNextTier(refCount: number): number {
  const tierInfo = getReferralTierInfo(refCount)
  if (!tierInfo.nextTierData) return 0
  return tierInfo.nextTierData.min - refCount
}
