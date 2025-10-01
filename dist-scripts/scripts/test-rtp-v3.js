"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtpConfig_v3_1 = require("../src/games/rtpConfig-v3");
const cases = [
    { key: 'dice', betArray: rtpConfig_v3_1.BET_ARRAYS_V3['dice'].calculateBetArray(50) },
    { key: 'magic8ball', betArray: rtpConfig_v3_1.BET_ARRAYS_V3['magic8ball'].calculateBetArray() },
    { key: 'mines', betArray: rtpConfig_v3_1.BET_ARRAYS_V3['mines'].calculateBetArray(3, 0) },
    { key: 'plinko', betArray: rtpConfig_v3_1.BET_ARRAYS_V3['plinko'].calculateBetArray('normal') },
];
console.log('Running RTP validation tests for V3...');
for (const c of cases) {
    const actual = rtpConfig_v3_1.V3_UTILS.calculateRTP(c.key, c.betArray);
    const target = rtpConfig_v3_1.RTP_TARGETS_V3[c.key];
    const valid = rtpConfig_v3_1.V3_UTILS.validateRTP(c.key, c.betArray);
    console.log(`- ${c.key}: target=${(target * 100).toFixed(2)}% actual=${(actual * 100).toFixed(2)}% valid=${valid}`);
}
console.log('Done.');
