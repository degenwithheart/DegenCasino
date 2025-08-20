import { FLIP_CONFIG } from '../rtpConfig'

export const VAULT_CRACK_CONFIG = {
  SIDES: ['crack', 'fail'],
  crack: [1.92, 0], // 96% RTP, 50% win rate
  fail: [0, 1.92],
}
