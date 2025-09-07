Commit: d2526df
Date: 2025-08-19
Old message: New Layout
 .gitignore                                         |     8 +
 api/auth.ts                                        |    10 +
 api/chat.ts                                        |    32 +
 api/helius.ts                                      |    25 +
 index.html                                         |    23 +
 package-lock.json                                  | 24871 +++++++++++++++++++
 package.json                                       |    57 +
 postcss.config.js                                  |     6 +
 public/$DGHRT.png                                  |   Bin 0 -> 1597081 bytes
 public/casino.png                                  |   Bin 0 -> 705686 bytes
 public/fakemoney.png                               |   Bin 0 -> 1744 bytes
 public/favicon.ico                                 |   Bin 0 -> 15406 bytes
 public/favicon.png                                 |   Bin 0 -> 23999 bytes
 public/games/blackjack-dual.png                    |   Bin 0 -> 1361250 bytes
 public/games/blackjack.png                         |   Bin 0 -> 1739398 bytes
 public/games/crash.png                             |   Bin 0 -> 1908089 bytes
 public/games/dice.png                              |   Bin 0 -> 1493263 bytes
 public/games/flip-dual.png                         |   Bin 0 -> 1367197 bytes
 public/games/flip.png                              |   Bin 0 -> 1747803 bytes
 public/games/hilo.png                              |   Bin 0 -> 1587854 bytes
 public/games/mines.png                             |   Bin 0 -> 1320519 bytes
 public/games/plinko-race.png                       |   Bin 0 -> 1249121 bytes
 public/games/plinko.png                            |   Bin 0 -> 1669948 bytes
 public/games/roulette.png                          |   Bin 0 -> 1748292 bytes
 public/games/slots.png                             |   Bin 0 -> 1690629 bytes
 public/icon-192.png                                |   Bin 0 -> 26617 bytes
 public/icon-512.png                                |   Bin 0 -> 128958 bytes
 public/index.html                                  |    45 +
 public/manifest.webmanifest                        |    23 +
 public/overlay-glow.png                            |   Bin 0 -> 1468219 bytes
 public/pfp.png                                     |   Bin 0 -> 1778881 bytes
 public/seo.png                                     |   Bin 0 -> 458602 bytes
 public/stuff.png                                   |   Bin 0 -> 3264 bytes
 public/user.png                                    |   Bin 0 -> 1597081 bytes
 readme.md                                          |   224 +
 src/App.tsx                                        |   199 +
 src/GlobalErrorBoundary.tsx                        |    34 +
 src/components/AllGamesModalContent.tsx            |   202 +
 src/components/BonusModal.tsx                      |   261 +
 src/components/ConnectionStatus.tsx                |   553 +
 src/components/Dropdown.tsx                        |    63 +
 src/components/EnhancedGameControls.tsx            |   318 +
 src/components/EnhancedTickerTape.tsx              |   346 +
 src/components/ErrorModal.tsx                      |   116 +
 src/components/FeesTab.tsx                         |   158 +
 src/components/GameScreenFrame.tsx                 |    94 +
 src/components/GameSplashScreen.tsx                |   335 +
 src/components/Icon.tsx                            |   183 +
 src/components/JackpotModal.tsx                    |   452 +
 src/components/MobileControls.tsx                  |   377 +
 src/components/MobileGameControls.tsx              |   235 +
 src/components/Modal.tsx                           |   167 +
 src/components/PropagationStatus.tsx               |    32 +
 src/components/Sidebar.tsx                         |   172 +
 src/components/Slider.tsx                          |    94 +
 src/components/TrollBox.tsx                        |   384 +
 src/components/casino/CasinoAmbientFX.tsx          |    66 +
 src/components/casino/PhysicsChips.tsx             |     0
 src/components/index.tsx                           |    47 +
 src/constants.ts                                   |   268 +
 src/constants/QuotesVault.ts                       |   185 +
 src/constants/errorCodes.ts                        |    55 +
 src/games/BlackJack-v1/Card.tsx                    |    90 +
 src/games/BlackJack-v1/CardComponents.tsx          |   144 +
 .../BlackJack-v1/components/CardComponents.tsx     |   144 +
 .../BlackJack-v1/components/CreateGameModal.tsx    |   338 +
 .../BlackJack-v1/components/DebugGameScreen.tsx    |   609 +
 src/games/BlackJack-v1/components/GameScreen.tsx   |   582 +
 src/games/BlackJack-v1/components/Lobby.tsx        |   300 +
 src/games/BlackJack-v1/components/index.tsx        |     4 +
 src/games/BlackJack-v1/constants.ts                |    54 +
 src/games/BlackJack-v1/index.tsx                   |    91 +
 src/games/BlackJack-v1/sounds/card.mp3             |   Bin 0 -> 4248 bytes
 src/games/BlackJack-v1/sounds/lose.mp3             |   Bin 0 -> 21192 bytes
 src/games/BlackJack-v1/sounds/play.mp3             |   Bin 0 -> 17266 bytes
 src/games/BlackJack-v1/sounds/win.mp3              |   Bin 0 -> 9452 bytes
 src/games/BlackJack-v1/sounds/win2.mp3             |   Bin 0 -> 24359 bytes
 .../BlackjackBackground.enhanced.styles.ts         |   234 +
 src/games/BlackJack/CardComponents.tsx             |   144 +
 src/games/BlackJack/card.mp3                       |   Bin 0 -> 4248 bytes
 src/games/BlackJack/constants.ts                   |    54 +
 src/games/BlackJack/index.tsx                      |   277 +
 src/games/BlackJack/lose.mp3                       |   Bin 0 -> 21192 bytes
 src/games/BlackJack/play.mp3                       |   Bin 0 -> 17266 bytes
 src/games/BlackJack/styles.ts                      |    74 +
 src/games/BlackJack/win.mp3                        |   Bin 0 -> 9452 bytes
 src/games/BlackJack/win2.mp3                       |   Bin 0 -> 24359 bytes
 .../CrashGame/CrashBackground.enhanced.styles.ts   |   267 +
 src/games/CrashGame/Slider.tsx                     |    99 +
 src/games/CrashGame/crash.mp3                      |   Bin 0 -> 53637 bytes
 src/games/CrashGame/index.tsx                      |   145 +
 src/games/CrashGame/music.mp3                      |   Bin 0 -> 1394431 bytes
 src/games/CrashGame/rocket.gif                     |   Bin 0 -> 1853209 bytes
 src/games/CrashGame/styles.ts                      |   119 +
 src/games/CrashGame/utils.ts                       |    36 +
 src/games/CrashGame/win.mp3                        |   Bin 0 -> 86526 bytes
 src/games/Dice/DiceBackground.enhanced.styles.ts   |   209 +
 src/games/Dice/DiceBackground.styles.ts            |     0
 src/games/Dice/DicePhysics.tsx                     |   112 +
 src/games/Dice/Slider.tsx                          |   128 +
 src/games/Dice/constants.ts                        |     4 +
 src/games/Dice/index.tsx                           |   160 +
 src/games/Dice/lose.mp3                            |   Bin 0 -> 21192 bytes
 src/games/Dice/play.mp3                            |   Bin 0 -> 17266 bytes
 src/games/Dice/styles-new.ts                       |   291 +
 src/games/Dice/styles.ts                           |    91 +
 src/games/Dice/tick.mp3                            |   Bin 0 -> 1440 bytes
 src/games/Dice/win.mp3                             |   Bin 0 -> 73992 bytes
 src/games/ExampleGame/index.tsx                    |    87 +
 src/games/ExampleGame/test.mp3                     |   Bin 0 -> 5228 bytes
 .../Flip-v1/FlipV1Background.enhanced.styles.ts    |   170 +
 src/games/Flip-v1/components/Coin.tsx              |    70 +
 src/games/Flip-v1/components/CreateGameModal.tsx   |   328 +
 src/games/Flip-v1/components/DebugGameScreen.tsx   |   432 +
 src/games/Flip-v1/components/Effect.tsx            |    15 +
 src/games/Flip-v1/components/GameScreen.tsx        |   396 +
 src/games/Flip-v1/components/Lobby.tsx             |   302 +
 src/games/Flip-v1/components/index.ts              |     6 +
 src/games/Flip-v1/heads.png                        |   Bin 0 -> 310164 bytes
 src/games/Flip-v1/index.tsx                        |   117 +
 src/games/Flip-v1/sounds/coin.mp3                  |   Bin 0 -> 4652 bytes
 src/games/Flip-v1/sounds/lose.mp3                  |   Bin 0 -> 10988 bytes
 src/games/Flip-v1/sounds/win.mp3                   |   Bin 0 -> 9452 bytes
 src/games/Flip-v1/star.png                         |   Bin 0 -> 2056 bytes
 src/games/Flip-v1/tails.png                        |   Bin 0 -> 310248 bytes
 src/games/Flip/Coin.tsx                            |    70 +
 src/games/Flip/Effect.tsx                          |    46 +
 src/games/Flip/FlipBackground.enhanced.styles.ts   |   234 +
 src/games/Flip/coin.mp3                            |   Bin 0 -> 4652 bytes
 src/games/Flip/heads.png                           |   Bin 0 -> 310164 bytes
 src/games/Flip/index.tsx                           |   186 +
 src/games/Flip/lose.mp3                            |   Bin 0 -> 10988 bytes
 src/games/Flip/star.png                            |   Bin 0 -> 2056 bytes
 src/games/Flip/styles.ts                           |     0
 src/games/Flip/tails.png                           |   Bin 0 -> 310248 bytes
 src/games/Flip/win.mp3                             |   Bin 0 -> 9452 bytes
 src/games/HiLo/HiLoBackground.enhanced.styles.ts   |   247 +
 src/games/HiLo/card.mp3                            |   Bin 0 -> 4248 bytes
 src/games/HiLo/constants.ts                        |    26 +
 src/games/HiLo/finish.mp3                          |   Bin 0 -> 26952 bytes
 src/games/HiLo/index.tsx                           |   271 +
 src/games/HiLo/lose.mp3                            |   Bin 0 -> 21192 bytes
 src/games/HiLo/play.mp3                            |   Bin 0 -> 17266 bytes
 src/games/HiLo/styles.ts                           |   153 +
 src/games/HiLo/win.mp3                             |   Bin 0 -> 9452 bytes
 src/games/Mines/MinesBackground.enhanced.styles.ts |   267 +
 src/games/Mines/axe.mp3                            |   Bin 0 -> 15212 bytes
 src/games/Mines/constants.ts                       |     9 +
 src/games/Mines/explode.mp3                        |   Bin 0 -> 32876 bytes
 src/games/Mines/finish.mp3                         |   Bin 0 -> 26952 bytes
 src/games/Mines/index.tsx                          |   252 +
 src/games/Mines/step.mp3                           |   Bin 0 -> 8684 bytes
 src/games/Mines/styles.ts                          |   171 +
 src/games/Mines/tick.mp3                           |   Bin 0 -> 64748 bytes
 src/games/Mines/types.ts                           |    11 +
 src/games/Mines/utils.ts                           |    47 +
 src/games/Mines/win.mp3                            |   Bin 0 -> 42476 bytes
 .../Plinko/PlinkoBackground.enhanced.styles.ts     |   346 +
 src/games/Plinko/bump.mp3                          |   Bin 0 -> 1440 bytes
 src/games/Plinko/fall.mp3                          |   Bin 0 -> 10604 bytes
 src/games/Plinko/game.ts                           |   356 +
 src/games/Plinko/index.tsx                         |   279 +
 src/games/Plinko/styles.ts                         |     0
 src/games/Plinko/win.mp3                           |   Bin 0 -> 42476 bytes
 .../PlinkoRaceBackground.enhanced.styles.ts        |   268 +
 src/games/PlinkoRace/board/Board.tsx               |   294 +
 src/games/PlinkoRace/board/BoardHUD.tsx            |    46 +
 src/games/PlinkoRace/board/BoardRenderer.tsx       |   419 +
 src/games/PlinkoRace/board/Scoreboard.tsx          |   222 +
 .../PlinkoRace/components/CreateGameModal.tsx      |   363 +
 .../PlinkoRace/components/DebugGameScreen.tsx      |   270 +
 src/games/PlinkoRace/components/GameScreen.tsx     |   199 +
 src/games/PlinkoRace/components/Lobby.tsx          |   319 +
 .../PlinkoRace/components/LobbyBackground.tsx      |   162 +
 src/games/PlinkoRace/engine/PhysicsWorld.ts        |    84 +
 src/games/PlinkoRace/engine/SimulationEngine.ts    |   391 +
 src/games/PlinkoRace/engine/constants.ts           |    58 +
 src/games/PlinkoRace/engine/deterministic.ts       |    21 +
 src/games/PlinkoRace/engine/index.ts               |     5 +
 src/games/PlinkoRace/engine/types.ts               |    21 +
 src/games/PlinkoRace/hooks/useMultiPlinko.ts       |    35 +
 src/games/PlinkoRace/index.tsx                     |    67 +
 src/games/PlinkoRace/musicManager.ts               |    50 +
 src/games/PlinkoRace/sounds/action.mp3             |   Bin 0 -> 802733 bytes
 src/games/PlinkoRace/sounds/bigcombo.mp3           |   Bin 0 -> 7958 bytes
 src/games/PlinkoRace/sounds/bump.mp3               |   Bin 0 -> 1440 bytes
 src/games/PlinkoRace/sounds/extraball.mp3          |   Bin 0 -> 14266 bytes
 src/games/PlinkoRace/sounds/fall.mp3               |   Bin 0 -> 10604 bytes
 src/games/PlinkoRace/sounds/finsh.mp3              |   Bin 0 -> 6286 bytes
 src/games/PlinkoRace/sounds/lobby.mp3              |   Bin 0 -> 907244 bytes
 src/games/PlinkoRace/sounds/lobbymusic.mp3         |   Bin 0 -> 1200109 bytes
 src/games/PlinkoRace/sounds/ouch.mp3               |   Bin 0 -> 5696 bytes
 src/games/PlinkoRace/sounds/readygo.mp3            |   Bin 0 -> 18413 bytes
 src/games/PlinkoRace/sounds/win.mp3                |   Bin 0 -> 42476 bytes
 src/games/Roulette/Chip.tsx                        |    56 +
 src/games/Roulette/Roulette.styles.ts              |   121 +
 .../Roulette/RouletteBackground.enhanced.styles.ts |   269 +
 src/games/Roulette/Table.tsx                       |    63 +
 src/games/Roulette/Wheel.authentic.styles.ts       |   347 +
 src/games/Roulette/Wheel.tsx                       |    94 +
 src/games/Roulette/chip.mp3                        |   Bin 0 -> 1831 bytes
 src/games/Roulette/constants.ts                    |    73 +
 src/games/Roulette/index.tsx                       |   268 +
 src/games/Roulette/lose.mp3                        |   Bin 0 -> 21192 bytes
 src/games/Roulette/play.mp3                        |   Bin 0 -> 17266 bytes
 src/games/Roulette/signals.ts                      |    67 +
 src/games/Roulette/win.mp3                         |   Bin 0 -> 9452 bytes
 src/games/Slots/ItemPreview.styles.ts              |   112 +
 src/games/Slots/ItemPreview.tsx                    |    39 +
 src/games/Slots/Slot.styles.ts                     |    66 +
 src/games/Slots/Slot.tsx                           |   201 +
 src/games/Slots/SlotComponents.tsx                 |   269 +
 src/games/Slots/Slots.styles.ts                    |   347 +
 src/games/Slots/assets/coin.mp3                    |   Bin 0 -> 44012 bytes
 src/games/Slots/assets/insert.mp3                  |   Bin 0 -> 44012 bytes
 src/games/Slots/assets/lose.mp3                    |   Bin 0 -> 25032 bytes
 src/games/Slots/assets/money.mp3                   |   Bin 0 -> 119660 bytes
 src/games/Slots/assets/play.mp3                    |   Bin 0 -> 17266 bytes
 src/games/Slots/assets/reveal-legendary.mp3        |   Bin 0 -> 53996 bytes
 src/games/Slots/assets/reveal.mp3                  |   Bin 0 -> 42476 bytes
 src/games/Slots/assets/slot-bonk.png               |   Bin 0 -> 134126 bytes
 src/games/Slots/assets/slot-dghrt.png              |   Bin 0 -> 1597081 bytes
 src/games/Slots/assets/slot-jup.png                |   Bin 0 -> 28312 bytes
 src/games/Slots/assets/slot-sol.png                |   Bin 0 -> 111290 bytes
 src/games/Slots/assets/slot-unicorn.png            |   Bin 0 -> 106788 bytes
 src/games/Slots/assets/slot-usdc.png               |   Bin 0 -> 9276 bytes
 src/games/Slots/assets/slot-wojak.png              |   Bin 0 -> 185454 bytes
 src/games/Slots/assets/spin.mp3                    |   Bin 0 -> 108140 bytes
 src/games/Slots/assets/win.mp3                     |   Bin 0 -> 69864 bytes
 src/games/Slots/constants.ts                       |    42 +
 src/games/Slots/index.tsx                          |   232 +
 src/games/Slots/utils.ts                           |    67 +
 src/games/allGames.ts                              |   171 +
 src/games/featuredGames.ts                         |     7 +
 src/games/getVisibleGames.ts                       |    20 +
 src/games/index.tsx                                |     1 +
 src/games/types.ts                                 |    18 +
 src/games/useGameMeta.ts                           |     6 +
 src/hooks/useIsCompact.ts                          |    27 +
 src/hooks/useLeaderboardData.ts                    |    78 +
 src/hooks/useMediaQuery.ts                         |    30 +
 src/hooks/useOnClickOutside.ts                     |    21 +
 src/hooks/useOutsideClick.ts                       |    17 +
 src/hooks/useToast.ts                              |    37 +
 src/hooks/useTokenPriceChanges.ts                  |   144 +
 src/hooks/useTokenPriceService.ts                  |    50 +
 src/hooks/useTokenPrices.ts                        |    23 +
 src/hooks/useUserStore.ts                          |    44 +
 src/index.tsx                                      |    92 +
 src/sections/Dashboard/AboutMe.tsx                 |   396 +
 src/sections/Dashboard/Dashboard.tsx               |   450 +
 src/sections/Dashboard/FeaturedGameCard.tsx        |   109 +
 src/sections/Dashboard/FeaturedInlineGame.tsx      |    79 +
 src/sections/Dashboard/GameCard.tsx                |   264 +
 src/sections/Dashboard/Terms.tsx                   |   450 +
 src/sections/Dashboard/WelcomeBanner.tsx           |   488 +
 src/sections/Dashboard/Whitepaper.tsx              |   400 +
 src/sections/Footer.tsx                            |   402 +
 src/sections/Game/Game.styles.ts                   |   772 +
 src/sections/Game/Game.tsx                         |   816 +
 src/sections/Game/LoadingBar.tsx                   |    88 +
 src/sections/Game/ProvablyFairModal.tsx            |   298 +
 src/sections/Game/TransactionModal.tsx             |   161 +
 src/sections/Game/WagerControlsGlobalStyles.tsx    |    99 +
 src/sections/Header.tsx                            |   299 +
 src/sections/LeaderBoard/Icon.tsx                  |   183 +
 .../LeaderBoard/LeaderboardsModal.styles.ts        |   338 +
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |   114 +
 src/sections/LeaderBoard/Modal.tsx                 |   164 +
 src/sections/RecentPlays/RecentPlays.styles.ts     |    89 +
 src/sections/RecentPlays/RecentPlays.tsx           |    91 +
 src/sections/RecentPlays/ShareModal.tsx            |    79 +
 src/sections/RecentPlays/useRecentPlays.ts         |    86 +
 src/sections/Toasts.tsx                            |   157 +
 src/sections/TokenSelect.tsx                       |   383 +
 src/sections/UserButton.tsx                        |   403 +
 src/sections/UserProfile.tsx                       |   668 +
 src/sections/userProfileUtils.ts                   |   171 +
 src/sections/walletConnect.ts                      |    27 +
 src/services/TokenPriceService.ts                  |   206 +
 src/styles.css                                     |   450 +
 src/styles.ts                                      |    55 +
 src/utils.ts                                       |    15 +
 src/utils/emitChips.ts                             |     0
 src/utils/timeAccess.ts                            |    67 +
 tailwind.config.ts                                 |    38 +
 tsconfig.json                                      |    24 +
 vercel.json                                        |    35 +
 vite.config.ts                                     |    72 +
 289 files changed, 56713 insertions(+)

Commit: d23af7c
Date: 2025-08-19
Old message: Update Game.tsx
 src/sections/Game/Game.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 0952607
Date: 2025-08-19
Old message: Create .env
 .env | 31 +++++++++++++++++++++++++++++++
 1 file changed, 31 insertions(+)

Commit: 8ac3a7b
Date: 2025-08-20
Old message: Global rtpConfig for all games & new Audit page.
 .gitignore                                         |   2 +
 index.html                                         |  26 +-
 package-lock.json                                  |  15 +
 package.json                                       |   1 +
 screenshots/1.jpg                                  | Bin 0 -> 211802 bytes
 screenshots/2.jpg                                  | Bin 0 -> 284904 bytes
 screenshots/3.jpg                                  | Bin 0 -> 322239 bytes
 src/App.tsx                                        |  76 +-
 src/constants.ts                                   |   7 +
 src/fairness/deterministicRng.ts                   |  22 +
 .../BlackJack-v1/components/CreateGameModal.tsx    |  28 +-
 .../BlackJack-v1/components/DebugGameScreen.tsx    |  30 +-
 src/games/BlackJack-v1/components/GameScreen.tsx   | 359 ++++-----
 src/games/BlackJack-v1/components/Lobby.tsx        |  32 +-
 src/games/BlackJack-v1/constants.ts                |   6 +-
 src/games/BlackJack-v1/multiplayer.ts              |  57 ++
 src/games/BlackJack/betArray.ts                    |   5 +
 src/games/BlackJack/constants.ts                   |   5 +-
 src/games/BlackJack/index.tsx                      | 170 ++--
 src/games/CrashGame/constants.ts                   |   3 +
 src/games/CrashGame/index.tsx                      |  22 +-
 src/games/CrashGame/styles.ts                      |  18 +-
 src/games/CrashGame/utils.ts                       |  36 +-
 src/games/Dice/DicePhysics.tsx                     |  20 +-
 src/games/Dice/constants.ts                        |   3 +
 src/games/Dice/index.tsx                           |  58 +-
 src/games/ExampleGame/index.tsx                    |  87 ---
 src/games/ExampleGame/test.mp3                     | Bin 5228 -> 0 bytes
 src/games/Flip-v1/components/DebugGameScreen.tsx   |   6 +-
 src/games/Flip-v1/components/GameScreen.tsx        |   5 +-
 src/games/Flip/betArrays.ts                        |   5 +
 src/games/Flip/constants.ts                        |   5 +
 src/games/Flip/index.tsx                           |   8 +-
 src/games/HiLo/betArray.ts                         |   5 +
 src/games/HiLo/constants.ts                        |   3 +-
 src/games/HiLo/index.tsx                           |  47 +-
 src/games/Mines/betArray.ts                        |   5 +
 src/games/Mines/constants.ts                       |   5 +-
 src/games/Mines/index.tsx                          |   5 +-
 src/games/Mines/utils.ts                           |  23 +-
 src/games/Plinko/betArrays.ts                      |   6 +
 src/games/Plinko/constants.ts                      |   5 +
 src/games/Plinko/index.tsx                         |  21 +-
 src/games/PlinkoRace/board/BoardRenderer.tsx       |  21 +-
 .../PlinkoRace/components/LobbyBackground.tsx      |   9 +-
 src/games/PlinkoRace/constants.ts                  |   5 +
 src/games/PlinkoRace/engine/SimulationEngine.ts    |   3 +-
 src/games/PlinkoRace/engine/constants.ts           |   3 +-
 src/games/Roulette/Chip.tsx                        |  56 --
 src/games/Roulette/Roulette.styles.ts              | 121 ---
 .../Roulette/RouletteBackground.enhanced.styles.ts | 269 -------
 src/games/Roulette/Table.tsx                       |  63 --
 src/games/Roulette/Wheel.authentic.styles.ts       | 347 ---------
 src/games/Roulette/Wheel.tsx                       |  94 ---
 src/games/Roulette/chip.mp3                        | Bin 1831 -> 0 bytes
 src/games/Roulette/constants.ts                    |  73 --
 src/games/Roulette/index.tsx                       | 268 -------
 src/games/Roulette/lose.mp3                        | Bin 21192 -> 0 bytes
 src/games/Roulette/play.mp3                        | Bin 17266 -> 0 bytes
 src/games/Roulette/signals.ts                      |  67 --
 src/games/Roulette/win.mp3                         | Bin 9452 -> 0 bytes
 src/games/Slots/Slot.tsx                           |  14 +-
 src/games/Slots/SlotComponents.tsx                 |  10 +-
 src/games/Slots/SlotsBackground.enhanced.styles.ts |  62 ++
 src/games/Slots/constants.ts                       |  32 +-
 src/games/Slots/index.tsx                          | 133 ++--
 src/games/Slots/utils.ts                           | 108 +--
 src/games/allGames.ts                              |  13 -
 src/games/rtpConfig.ts                             | 293 +++++++
 src/hooks/useGameOutcome.ts                        |  76 ++
 src/index.tsx                                      |  30 +-
 src/sections/Dashboard/FairnessAudit.tsx           | 853 +++++++++++++++++++++
 src/sections/Dashboard/WelcomeBanner.tsx           |   6 +-
 src/sections/Game/Game.tsx                         |   2 +-
 74 files changed, 2142 insertions(+), 2131 deletions(-)

Commit: cf0f534
Date: 2025-08-20
Old message: Merge remote-tracking branch 'origin/main' into main
Commit: 5bfcc9e
Date: 2025-08-20
Old message: Added the chatbox.
 .env                        |   6 +-
 .trollbox.json              |   1 +
 api/chat.ts                 | 101 ++++++++--
 package-lock.json           | 455 ++++++++++++++++++++++++++++++++++++++++++--
 package.json                |   1 +
 server.js                   |  65 +++++++
 src/components/TrollBox.tsx | 231 ++++++++++++++++------
 src/constants.ts            |   2 +-
 vite.config.ts              |   5 +-
 9 files changed, 774 insertions(+), 93 deletions(-)

Commit: a6f9c67
Date: 2025-08-20
Old message: Update .env
 .env | 10 ++++++++++
 1 file changed, 10 insertions(+)

Commit: bb0ad47
Date: 2025-08-20
Old message: Added the chatbox.
 .env         | 10 ++++++++++
 package.json |  1 +
 2 files changed, 11 insertions(+)

Commit: e93feda
Date: 2025-08-20
Old message: Added the chatbox.
Commit: cd741de
Date: 2025-08-20
Old message: Added the chatbox.
 postcss.config.js => postcss.config.cjs | 0
 1 file changed, 0 insertions(+), 0 deletions(-)

Commit: a100f39
Date: 2025-08-20
Old message: Added the chatbox.
 api/chat.ts | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)

Commit: 3563644
Date: 2025-08-20
Old message: Added the chatbox.
 .env       | 2 +-
 .gitignore | 1 -
 2 files changed, 1 insertion(+), 2 deletions(-)

Commit: c0e9914
Date: 2025-08-20
Old message: Styling the chatbox.
 .gitignore                              |  1 +
 src/sections/RecentPlays/ShareModal.tsx | 78 ++++++++++++++++++++-------------
 2 files changed, 48 insertions(+), 31 deletions(-)

Commit: b1811ad
Date: 2025-08-20
Old message: Updated a redirect bug
 src/sections/RecentPlays/ShareModal.tsx | 9 +++++++--
 1 file changed, 7 insertions(+), 2 deletions(-)

Commit: a6bb338
Date: 2025-08-20
Old message: Updated Plinko
 src/games/Plinko/game.ts   | 252 +++++++++++++++++++++++++++++----------------
 src/games/Plinko/index.tsx | 200 ++++++++++++++++++-----------------
 src/games/rtpConfig.ts     |  40 +------
 3 files changed, 264 insertions(+), 228 deletions(-)

Commit: 5b8cc50
Date: 2025-08-20
Old message: Updated TickerTape
 src/components/EnhancedTickerTape.tsx |  29 +++--
 src/games/Plinko/index.tsx            |  11 --
 src/games/rtpConfig.ts                | 226 +++++++++++++++++++++-------------
 3 files changed, 163 insertions(+), 103 deletions(-)

Commit: 8f03ee2
Date: 2025-08-20
Old message: Delete .env
 .env | 51 ---------------------------------------------------
 1 file changed, 51 deletions(-)

Commit: 2eade01
Date: 2025-08-20
Old message: Updated Server Status
 src/constants.ts          |   2 +-
 src/pages/propagation.tsx | 601 ++++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 602 insertions(+), 1 deletion(-)

Commit: ba02e1e
Date: 2025-08-20
Old message: Updated Server Status
Commit: 0ec8747
Date: 2025-08-20
Old message: Updated Server Status
 api/check-dns.ts | 101 +++++++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 101 insertions(+)

Commit: 7c90322
Date: 2025-08-20
Old message: Updated Server Status
 src/App.tsx | 2 ++
 1 file changed, 2 insertions(+)

Commit: 76a7bf0
Date: 2025-08-20
Old message: Added caching for all RPC/API calls
 api/chat.ts                       |  4 +-
 api/check-dns.ts                  | 79 ++++++++++++++++++++------------------
 api/helius.ts                     | 19 +++++----
 api/xcache-edge.ts                | 40 +++++++++++++++++++
 api/xcacheOnTheFly.ts             | 34 ++++++++++++++++
 package-lock.json                 | 81 +++++++++++++++++++++++++++++++++++++++
 package.json                      |  1 +
 src/services/TokenPriceService.ts |  8 +---
 8 files changed, 213 insertions(+), 53 deletions(-)

Commit: 99a85b1
Date: 2025-08-20
Old message: Added caching for all RPC/API calls
 package.json | 4 +---
 1 file changed, 1 insertion(+), 3 deletions(-)

Commit: e631fa6
Date: 2025-08-20
Old message: Added caching for all RPC/API calls
 api/auth.ts   | 2 +-
 api/helius.ts | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)

Commit: 3e33186
Date: 2025-08-20
Old message: Added caching for all RPC/API calls
 api/xcache-edge.ts    | 22 ++--------------------
 api/xcacheOnTheFly.ts |  7 ++++---
 package.json          |  1 -
 3 files changed, 6 insertions(+), 24 deletions(-)

Commit: adf66e9
Date: 2025-08-20
Old message: Updated DNS calls
 api/check-dns.ts                    | 10 ++++++-
 src/components/ConnectionStatus.tsx | 58 ++++++-------------------------------
 2 files changed, 18 insertions(+), 50 deletions(-)

Commit: 3688302
Date: 2025-08-20
Old message: Updated DNS calls
 api/check-dns.ts | 10 ++++------
 1 file changed, 4 insertions(+), 6 deletions(-)

Commit: 41c3248
Date: 2025-08-20
Old message: Updated DNS calls
 src/pages/propagation.tsx | 10 +++++++++-
 1 file changed, 9 insertions(+), 1 deletion(-)

Commit: 90399a4
Date: 2025-08-20
Old message: Updated DNS calls
 api/check-dns.ts | 147 ++++++++++++++++++++++++++++++++++++++++++-------------
 1 file changed, 113 insertions(+), 34 deletions(-)

Commit: 68def2b
Date: 2025-08-20
Old message: Updated DNS calls
 api/check-dns.ts | 104 +++++++++++++++++++++++++++++--------------------------
 1 file changed, 54 insertions(+), 50 deletions(-)

Commit: c017b0c
Date: 2025-08-20
Old message: Updated DNS calls
 src/pages/propagation.tsx | 119 +++++++++++++++++++++++++++++++++++++++-------
 1 file changed, 101 insertions(+), 18 deletions(-)

Commit: 153e9bc
Date: 2025-08-20
Old message: Updated DNS calls
 src/pages/propagation.tsx | 44 +++++++++++++++++++++++++-------------------
 1 file changed, 25 insertions(+), 19 deletions(-)

Commit: 4edd87c
Date: 2025-08-20
Old message: Updated DNS calls
 src/pages/propagation.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: 7ff1b5c
Date: 2025-08-20
Old message: Styles for multiplayer games
 .gitignore                        |   3 +-
 src/games/BlockStack/constants.ts |   5 +
 src/games/BlockStack/index.tsx    | 159 ++++++++++++
 src/games/FlashHack/constants.ts  |   7 +
 src/games/FlashHack/index.tsx     | 521 ++++++++++++++++++++++++++++++++++++++
 src/games/HeistSpin/constants.ts  |   5 +
 src/games/HeistSpin/index.tsx     | 169 +++++++++++++
 src/games/MarketFlip/constants.ts |   5 +
 src/games/MarketFlip/index.tsx    | 164 ++++++++++++
 src/games/VaultCrack/constants.ts |   7 +
 src/games/VaultCrack/index.tsx    | 265 +++++++++++++++++++
 11 files changed, 1309 insertions(+), 1 deletion(-)

Commit: 0be9e12
Date: 2025-08-20
Old message: Chat message design update
 src/App.tsx                 |  2 +-
 src/components/TrollBox.tsx | 10 +++++++---
 2 files changed, 8 insertions(+), 4 deletions(-)

Commit: 7b567ac
Date: 2025-08-20
Old message: Chat message design update
 api/chat.ts                 | 21 +++++++++++++++++++++
 src/components/TrollBox.tsx | 35 ++++++++++++++++++++++++++++++++++-
 2 files changed, 55 insertions(+), 1 deletion(-)

Commit: de9d0f2
Date: 2025-08-20
Old message: Referral System added to the token modal and profile page
 src/index.tsx                |   4 +-
 src/sections/TokenSelect.tsx | 301 ++++++++++++++++++-------------------------
 src/sections/UserButton.tsx  |  76 +++--------
 3 files changed, 150 insertions(+), 231 deletions(-)

Commit: ba54ef9
Date: 2025-08-20
Old message: Referral System added to the token modal and profile page
 package-lock.json | 2857 ++++-------------------------------------------------
 1 file changed, 173 insertions(+), 2684 deletions(-)

Commit: 6aa0045
Date: 2025-08-20
Old message: Referral System added to the token modal and profile page
 src/components/TrollBox.tsx | 4 ++--
 src/constants.ts            | 4 ++--
 2 files changed, 4 insertions(+), 4 deletions(-)

Commit: 3d7fd72
Date: 2025-08-21
Old message: Added Explorer page
 package-lock.json                       | 1997 +++++++++++++++++++++++++++++--
 package.json                            |    1 +
 src/App.tsx                             |    9 +
 src/components/EmbeddedTransaction.tsx  |  146 +++
 src/components/ExplorerIndex.tsx        |  181 +++
 src/components/PlatformView.tsx         |  619 ++++++++++
 src/components/PlayerView.tsx           |  452 +++++++
 src/components/Transaction.tsx          | 1174 ++++++++++++++++++
 src/constants.ts                        |    9 +-
 src/hooks/useLeaderboardData.ts         |   12 +-
 src/sections/Dashboard/Dashboard.tsx    |    2 +-
 src/sections/RecentPlays/ShareModal.tsx |  146 ++-
 test-api.html                           |   45 +
 13 files changed, 4652 insertions(+), 141 deletions(-)

Commit: 97ddce8
Date: 2025-08-21
Old message: Restyled Explorer page
 src/components/ExplorerHeader.tsx | 91 ++++++++++++++++++++++++++++++++++++
 src/components/ExplorerIndex.tsx  | 97 ++++++++++++++++++++++++++++++++++-----
 src/components/PlatformView.tsx   |  4 +-
 src/components/PlayerView.tsx     |  2 +
 src/components/Transaction.tsx    |  4 +-
 src/constants.ts                  | 15 +++---
 6 files changed, 193 insertions(+), 20 deletions(-)

Commit: 8e82b37
Date: 2025-08-21
Old message: Updated TrollBox
 api/chat.ts                     |  2 +-
 src/components/PlatformView.tsx |  1 -
 src/components/TrollBox.tsx     | 87 ++++++++++++++++++++++++++++++++++++++---
 3 files changed, 82 insertions(+), 8 deletions(-)

Commit: 3a003af
Date: 2025-08-21
Old message: Updated NavBar
 src/constants.ts | 29 ++++++++---------------------
 1 file changed, 8 insertions(+), 21 deletions(-)

Commit: f9cf782
Date: 2025-08-21
Old message: Mines game has a new design & Progressive Poker is now truely progressive
 .trollbox.json                                     |   1 -
 public/games/poker.png                             | Bin 0 -> 1739398 bytes
 public/games/progressive-poker.png                 | Bin 0 -> 1383658 bytes
 server.js                                          |  65 ---
 src/games/Mines/index.tsx                          | 220 +++++++++-
 src/games/Mines/styles.ts                          |   3 +-
 src/games/ProgressivePoker/PokerCard.tsx           | 116 ++++++
 .../ProgressiveBackground.enhanced.styles.ts       | 262 ++++++++++++
 src/games/ProgressivePoker/betArray.ts             |  11 +
 src/games/ProgressivePoker/constants.ts            |  21 +
 src/games/ProgressivePoker/index.tsx               | 460 +++++++++++++++++++++
 src/games/ProgressivePoker/sounds/card.mp3         | Bin 0 -> 4248 bytes
 src/games/ProgressivePoker/sounds/lose.mp3         | Bin 0 -> 21192 bytes
 src/games/ProgressivePoker/sounds/play.mp3         | Bin 0 -> 17266 bytes
 src/games/ProgressivePoker/sounds/win.mp3          | Bin 0 -> 9452 bytes
 src/games/ProgressivePoker/sounds/win2.mp3         | Bin 0 -> 24359 bytes
 src/games/allGames.ts                              |  13 +
 src/games/rtpConfig.ts                             | 166 ++++++++
 src/sections/Dashboard/FairnessAudit.tsx           |   6 +
 test-api.html                                      |  45 --
 20 files changed, 1257 insertions(+), 132 deletions(-)

Commit: 7c16189
Date: 2025-08-22
Old message: Mines game has a new design & Progressive Poker is now truely progressive
 src/games/Mines/index.tsx | 43 ++++++++++++++++++++++++++++++++-----------
 1 file changed, 32 insertions(+), 11 deletions(-)

Commit: a8f6bf9
Date: 2025-08-22
Old message: Mines game has a new design & Progressive Poker is now truely progressive
 src/components/ExplorerIndex.tsx      |  66 --------
 src/sections/Dashboard/AboutMe.tsx    | 108 +++-----------
 src/sections/Dashboard/Terms.tsx      | 102 ++++---------
 src/sections/Dashboard/Whitepaper.tsx | 170 ++++++---------------
 src/sections/UserProfile.tsx          | 273 ++++++++++------------------------
 5 files changed, 166 insertions(+), 553 deletions(-)

Commit: b06e75d
Date: 2025-08-22
Old message: Recalibrated all games for a better visual result.
 BLACKJACK_BUG_REPORT.md                            |  69 ++
 FINAL_INTEGRATION_RESULTS.md                       | 104 +++
 GAME_TESTING_README.md                             | 231 ++++++
 GLOBAL_TRUST_CRISIS_REPORT.md                      | 142 ++++
 TRUST_CRISIS_RESOLUTION_REPORT.md                  | 161 ++++
 accurate-integration-test.js                       | 465 +++++++++++
 comprehensive-game-test-js.js                      | 494 ++++++++++++
 comprehensive-trust-fix-test.cjs                   | 403 +++++++++
 enhanced-real-game-test.ts                         | 789 ++++++++++++++++++
 final-visual-payout-verification.cjs               | 269 ++++++
 global-trust-audit.js                              | 385 +++++++++
 package-lock.json                                  |  68 +-
 package.json                                       |  10 +-
 quick-game-test.js                                 | 199 +++++
 real-integration-test.js                           | 517 ++++++++++++
 .../BlackjackBackground.enhanced.styles.ts         | 898 +++++++++++++++++----
 src/games/BlackJack/index.tsx                      | 260 ++++--
 src/games/BlockStack/constants.ts                  |   5 -
 src/games/BlockStack/index.tsx                     | 159 ----
 src/games/Dice/DiceBackground.enhanced.styles.ts   | 295 +++++++
 src/games/Dice/index.tsx                           | 116 ++-
 src/games/FlashHack/constants.ts                   |   7 -
 src/games/FlashHack/index.tsx                      | 521 ------------
 src/games/Flip/FlipBackground.enhanced.styles.ts   | 266 ++++++
 src/games/Flip/index.tsx                           | 136 ++--
 src/games/HeistSpin/constants.ts                   |   5 -
 src/games/HeistSpin/index.tsx                      | 169 ----
 src/games/MarketFlip/constants.ts                  |   5 -
 src/games/MarketFlip/index.tsx                     | 164 ----
 src/games/Mines/index.tsx                          |   9 +-
 src/games/VaultCrack/constants.ts                  |   7 -
 src/games/VaultCrack/index.tsx                     | 265 ------
 src/games/allGames.ts                              |   2 +-
 targeted-mismatch-detector.cjs                     | 266 ++++++
 ...ntegration-report-2025-08-22T01-49-11-783Z.json | 466 +++++++++++
 ...ntegration-report-2025-08-22T02-19-33-472Z.json | 420 ++++++++++
 ...yout-verification-2025-08-22T02-22-41-686Z.json |  59 ++
 ...lobal-trust-audit-2025-08-22T02-04-28-849Z.json | 186 +++++
 ...lobal-trust-audit-2025-08-22T02-19-48-668Z.json | 145 ++++
 ...ation-test-report-2025-08-22T01-46-58-719Z.json | 509 ++++++++++++
 ...ation-test-report-2025-08-22T02-19-11-485Z.json | 437 ++++++++++
 ...ismatch-detection-2025-08-22T02-21-23-371Z.json |  38 +
 ...-fix-verification-2025-08-22T02-14-28-501Z.json |  88 ++
 ...-fix-verification-2025-08-22T02-15-54-084Z.json |  83 ++
 ...-fix-verification-2025-08-22T02-17-07-977Z.json |  81 ++
 45 files changed, 8710 insertions(+), 1663 deletions(-)

Commit: ad4aa12
Date: 2025-08-22
Old message: Updated Flip
 src/games/Flip/Coin.tsx                          | 10 +--
 src/games/Flip/Effect.tsx                        |  4 +-
 src/games/Flip/FlipBackground.enhanced.styles.ts | 22 +++++--
 src/games/Flip/index.tsx                         | 83 +++++++++++++++---------
 4 files changed, 73 insertions(+), 46 deletions(-)

Commit: 39fab89
Date: 2025-08-22
Old message: added Roulette
 package-lock.json                     |  15 ++
 package.json                          |   1 +
 roulette-integration-test.js          | 103 +++++++++++++
 roulette-test.js                      |  59 ++++++++
 roulette-visual-test.js               |  62 ++++++++
 src/games/Roulette/Chip.tsx           |  56 +++++++
 src/games/Roulette/Roulette.styles.ts |  94 ++++++++++++
 src/games/Roulette/Table.tsx          |  62 ++++++++
 src/games/Roulette/chip.mp3           | Bin 0 -> 1831 bytes
 src/games/Roulette/constants.ts       |  95 ++++++++++++
 src/games/Roulette/index.tsx          | 269 ++++++++++++++++++++++++++++++++++
 src/games/Roulette/lose.mp3           | Bin 0 -> 21192 bytes
 src/games/Roulette/play.mp3           | Bin 0 -> 17266 bytes
 src/games/Roulette/signals.ts         |  78 ++++++++++
 src/games/Roulette/win.mp3            | Bin 0 -> 9452 bytes
 src/games/allGames.ts                 |  13 ++
 src/games/rtpConfig.ts                | 183 +++++++++++++++++++++++
 17 files changed, 1090 insertions(+)

Commit: babc044
Date: 2025-08-22
Old message: added Roulette
 .gitignore                                         |  13 +
 BLACKJACK_BUG_REPORT.md                            |  69 --
 FINAL_INTEGRATION_RESULTS.md                       | 104 ---
 GAME_TESTING_README.md                             | 231 ------
 GLOBAL_TRUST_CRISIS_REPORT.md                      | 142 ----
 TRUST_CRISIS_RESOLUTION_REPORT.md                  | 161 -----
 accurate-integration-test.js                       | 465 ------------
 comprehensive-game-test-js.js                      | 494 -------------
 comprehensive-trust-fix-test.cjs                   | 403 -----------
 enhanced-real-game-test.ts                         | 789 ---------------------
 final-visual-payout-verification.cjs               | 269 -------
 global-trust-audit.js                              | 385 ----------
 postcss.config.cjs                                 |   6 -
 quick-game-test.js                                 | 199 ------
 real-integration-test.js                           | 517 --------------
 roulette-integration-test.js                       | 103 ---
 roulette-test.js                                   |  59 --
 roulette-visual-test.js                            |  62 --
 src/games/BlackJack/index.tsx                      |   5 +-
 src/games/ProgressivePoker/index.tsx               |  74 +-
 src/games/Roulette/index.tsx                       |  73 +-
 src/sections/Dashboard/FairnessAudit.tsx           |   5 +
 targeted-mismatch-detector.cjs                     | 266 -------
 ...ntegration-report-2025-08-22T01-49-11-783Z.json | 466 ------------
 ...ntegration-report-2025-08-22T02-19-33-472Z.json | 420 -----------
 ...yout-verification-2025-08-22T02-22-41-686Z.json |  59 --
 ...lobal-trust-audit-2025-08-22T02-04-28-849Z.json | 186 -----
 ...lobal-trust-audit-2025-08-22T02-19-48-668Z.json | 145 ----
 ...ation-test-report-2025-08-22T01-46-58-719Z.json | 509 -------------
 ...ation-test-report-2025-08-22T02-19-11-485Z.json | 437 ------------
 ...ismatch-detection-2025-08-22T02-21-23-371Z.json |  38 -
 ...-fix-verification-2025-08-22T02-14-28-501Z.json |  88 ---
 ...-fix-verification-2025-08-22T02-15-54-084Z.json |  83 ---
 ...-fix-verification-2025-08-22T02-17-07-977Z.json |  81 ---
 34 files changed, 103 insertions(+), 7303 deletions(-)

Commit: c3ae27c
Date: 2025-08-22
Old message: added Roulette
 src/components/PlatformView.tsx | 178 +++++++++++++++++++++++++++++++++-------
 src/constants.ts                |   2 +-
 2 files changed, 151 insertions(+), 29 deletions(-)

Commit: d9dc1c0
Date: 2025-08-22
Old message: added Roulette
 src/components/PlatformView.tsx | 141 ++++++++++++++++++++++++++++------------
 1 file changed, 100 insertions(+), 41 deletions(-)

Commit: b9a1f24
Date: 2025-08-22
Old message: added Roulette
 src/constants.ts                         | 2 +-
 src/sections/RecentPlays/RecentPlays.tsx | 4 +++-
 2 files changed, 4 insertions(+), 2 deletions(-)

Commit: 7840240
Date: 2025-08-22
Old message: added Roulette
 src/sections/RecentPlays/ShareModal.tsx | 14 ++++++++++++++
 1 file changed, 14 insertions(+)

Commit: 08e83f9
Date: 2025-08-22
Old message: added Roulette
 src/sections/RecentPlays/ShareModal.tsx |  6 +++---
 src/utils.ts                            | 10 +++++++---
 2 files changed, 10 insertions(+), 6 deletions(-)

Commit: 8652623
Date: 2025-08-22
Old message: Updating API
 .test_scripts/accurate-integration-test.js         | 465 ++++++++++++
 .test_scripts/comprehensive-game-test-js.js        | 495 +++++++++++++
 .test_scripts/comprehensive-trust-fix-test.cjs     | 404 +++++++++++
 .test_scripts/enhanced-real-game-test.ts           | 789 +++++++++++++++++++++
 .test_scripts/final-visual-payout-verification.cjs | 297 ++++++++
 .test_scripts/global-trust-audit.js                | 429 +++++++++++
 .test_scripts/postcss.config.cjs                   |   6 +
 .test_scripts/quick-game-test.js                   | 200 ++++++
 .test_scripts/real-integration-test.js             | 517 ++++++++++++++
 .test_scripts/targeted-mismatch-detector.cjs       | 296 ++++++++
 src/sections/RecentPlays/ShareModal.tsx            |  26 +-
 src/utils.ts                                       |  18 +-
 12 files changed, 3937 insertions(+), 5 deletions(-)

Commit: 0490ec0
Date: 2025-08-22
Old message: Updating API
 .gitignore                                         |   4 +-
 .test_scripts/accurate-integration-test.js         | 465 ------------
 .test_scripts/comprehensive-game-test-js.js        | 495 -------------
 .test_scripts/comprehensive-trust-fix-test.cjs     | 404 -----------
 .test_scripts/enhanced-real-game-test.ts           | 789 ---------------------
 .test_scripts/final-visual-payout-verification.cjs | 297 --------
 .test_scripts/global-trust-audit.js                | 429 -----------
 .test_scripts/postcss.config.cjs                   |   6 -
 .test_scripts/quick-game-test.js                   | 200 ------
 .test_scripts/real-integration-test.js             | 517 --------------
 .test_scripts/targeted-mismatch-detector.cjs       | 296 --------
 11 files changed, 2 insertions(+), 3900 deletions(-)

Commit: b8217ed
Date: 2025-08-22
Old message: Updating API
 src/sections/RecentPlays/ShareModal.tsx | 18 ++++++++++--------
 1 file changed, 10 insertions(+), 8 deletions(-)

Commit: f5280ad
Date: 2025-08-22
Old message: Updating ShareModal
 src/sections/RecentPlays/ShareModal.tsx | 83 ++++++++++++++-------------------
 1 file changed, 35 insertions(+), 48 deletions(-)

Commit: 4fb8670
Date: 2025-08-22
Old message: Updating ShareModal
 src/sections/RecentPlays/ShareModal.tsx | 51 ++++++++++++++-------------------
 1 file changed, 21 insertions(+), 30 deletions(-)

Commit: 06e4c1b
Date: 2025-08-22
Old message: Updating ShareModal
 src/sections/RecentPlays/ShareModal.tsx | 24 ++++++++++++------------
 1 file changed, 12 insertions(+), 12 deletions(-)

Commit: 461ffd3
Date: 2025-08-22
Old message: Updating ShareModal
 src/components/PlatformView.tsx | 289 ++++++----------------------------------
 1 file changed, 43 insertions(+), 246 deletions(-)

Commit: ce5e9f2
Date: 2025-08-22
Old message: Updating Mobile UI/UX
 src/components/PlatformView.tsx | 25 ++++++++++++++++++++++++-
 src/games/featuredGames.ts      |  2 +-
 2 files changed, 25 insertions(+), 2 deletions(-)

Commit: 255d034
Date: 2025-08-23
Old message: Integrating New Toast System
 src/App.tsx                    |   9 +-
 src/components/Transaction.tsx |  30 +++-
 src/constants/errorCodes.ts    |  27 ++++
 src/games/BlackJack/index.tsx  | 195 +++++++++++++------------
 src/games/CrashGame/index.tsx  |  40 +++--
 src/games/Dice/index.tsx       |  47 +++---
 src/sections/Game/Game.tsx     |  64 +-------
 src/sections/TokenSelect.tsx   |  35 +++--
 src/utils/solanaWalletToast.ts | 322 +++++++++++++++++++++++++++++++++++++++++
 9 files changed, 549 insertions(+), 220 deletions(-)

Commit: 6afc963
Date: 2025-08-23
Old message: Integrating New Toast System
 src/components/Transaction.tsx |   1 +
 src/games/BlackJack/index.tsx  | 195 +++++++++++++++++++----------------------
 src/games/CrashGame/index.tsx  |  40 ++++-----
 src/games/Dice/index.tsx       |  47 +++++-----
 src/sections/Game/Game.tsx     |   1 -
 src/utils/solanaWalletToast.ts |   4 +-
 6 files changed, 130 insertions(+), 158 deletions(-)

Commit: fb21081
Date: 2025-08-23
Old message: Integrating New Toast System
 src/games/Slots/index.tsx | 57 +++++++++++++++++++++--------------------------
 1 file changed, 25 insertions(+), 32 deletions(-)

Commit: 76314f9
Date: 2025-08-23
Old message: Integrating New Toast System
 src/games/Slots/index.tsx      | 10 ++++++++++
 src/utils/solanaWalletToast.ts | 14 ++++++++++++--
 2 files changed, 22 insertions(+), 2 deletions(-)

Commit: db086fb
Date: 2025-08-23
Old message: Updating Toast System Styling
 src/games/Slots/index.tsx      |  10 --
 src/sections/Toasts.tsx        | 239 +++++++++++++++++++++++++++++++++++------
 src/utils/solanaWalletToast.ts |  24 +++--
 3 files changed, 219 insertions(+), 54 deletions(-)

Commit: 4c00047
Date: 2025-08-23
Old message: Updating Toast System Styling
 src/components/GameScreenFrame.tsx |  4 +++-
 src/sections/Game/Game.tsx         | 36 +++++++++++++++++++++++++++++++++---
 2 files changed, 36 insertions(+), 4 deletions(-)

Commit: e228247
Date: 2025-08-23
Old message: Updating Toast System Styling
 src/components/GameScreenFrame.tsx | 7 ++++++-
 1 file changed, 6 insertions(+), 1 deletion(-)

Commit: 34d973d
Date: 2025-08-23
Old message: Updating Toast System Styling
 src/components/GameScreenFrame.tsx | 38 ++++++++++++++++++++++----------------
 src/games/Slots/index.tsx          |  5 ++++-
 2 files changed, 26 insertions(+), 17 deletions(-)

Commit: b99ff66
Date: 2025-08-23
Old message: Updating Toast System Styling
 src/sections/Toasts.tsx | 16 ++++++++++++----
 1 file changed, 12 insertions(+), 4 deletions(-)

Commit: 829530e
Date: 2025-08-23
Old message: Updating Toast System Styling
 src/games/Slots/index.tsx | 8 ++++----
 src/sections/Toasts.tsx   | 2 +-
 2 files changed, 5 insertions(+), 5 deletions(-)

Commit: b4582ca
Date: 2025-08-23
Old message: Updating Slots visual bug
 src/games/Slots/Slots.styles.ts | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: e77e302
Date: 2025-08-23
Old message: Updating Slots
 src/games/Slots/ItemPreview.styles.ts | 53 +++++++++++++++++++++++++++++
 src/games/Slots/ItemPreview.tsx       | 18 ++++++++--
 src/games/Slots/index.tsx             | 63 ++++-------------------------------
 3 files changed, 75 insertions(+), 59 deletions(-)

Commit: bf8c35d
Date: 2025-08-24
Old message: Updating Slots
 src/components/EnhancedGameControls.tsx   |  34 ++-
 src/components/MobileControls.tsx         | 371 ++++++++++++++++------
 src/components/MobileGameControls.tsx     |  33 +-
 src/games/Slots/ItemPreview.styles.ts     |  60 ++--
 src/games/Slots/Reel.tsx                  | 295 ++++++++++++++++++
 src/games/Slots/Slot.styles.ts            |   4 +-
 src/games/Slots/Slot.tsx                  |  92 +-----
 src/games/Slots/SlotComponents.tsx        |   2 +-
 src/games/Slots/Slots.styles.ts           | 129 +++++++-
 src/games/Slots/assets/slot-dghrt.png     | Bin 1597081 -> 310164 bytes
 src/games/Slots/assets/slot-legendary.png | Bin 0 -> 1013150 bytes
 src/games/Slots/assets/slot-mythical.png  | Bin 0 -> 953452 bytes
 src/games/Slots/constants.ts              |  18 +-
 src/games/Slots/index.tsx                 | 111 +++++--
 src/games/Slots/utils.ts                  | 212 +++++++++++--
 src/games/rtpConfig.ts                    |  96 +++---
 src/sections/Game/Game.styles.ts          | 491 +++++++++++++++++++-----------
 src/sections/Game/Game.tsx                | 182 +++++++----
 vite.config.ts                            |   1 +
 19 files changed, 1550 insertions(+), 581 deletions(-)

Commit: d9190d2
Date: 2025-08-24
Old message: Updating ProgressivePoker
 src/components/EnhancedGameControls.tsx            |  45 +++-
 src/components/GameScreenFrame.tsx                 | 142 ++++++++-----
 src/components/MobileControls.tsx                  |  10 +-
 src/components/MobileGameControls.tsx              |  10 +-
 .../BlackjackBackground.enhanced.styles.ts         |  21 +-
 src/games/BlackJack/index.tsx                      |  10 +-
 src/games/CrashGame/index.tsx                      |   6 +
 src/games/Dice/index.tsx                           |   6 +
 src/games/Flip/index.tsx                           |   6 +
 src/games/HiLo/index.tsx                           |   6 +
 src/games/Mines/index.tsx                          |  32 ++-
 src/games/Plinko/index.tsx                         |   6 +
 src/games/ProgressivePoker/index.tsx               | 234 +++++++++++++++++----
 src/games/Roulette/index.tsx                       |   6 +
 src/games/Slots/index.tsx                          |   7 +-
 src/games/rtpConfig.ts                             |  58 +++--
 src/utils/solanaWalletToast.ts                     |   6 +-
 17 files changed, 463 insertions(+), 148 deletions(-)

Commit: 894ca6f
Date: 2025-08-24
Old message: Updating ProgressivePoker
 src/components/GameScreenFrame.tsx | 42 +++++++++++++++++++-------------------
 1 file changed, 21 insertions(+), 21 deletions(-)

Commit: b62ad0e
Date: 2025-08-25
Old message: Integrated Accessabilities settings in game pages
 src/App.tsx                                        |   17 +-
 src/components/GameScreenFrame.tsx                 | 1042 ++++++++++++++++++--
 src/components/GameplayFrame.tsx                   |  193 ++++
 src/components/GraphicsSettings.tsx                |  398 ++++++++
 src/components/index.tsx                           |    2 +
 src/games/BlackJack-v1/Card.tsx                    |   90 --
 src/games/BlackJack-v1/CardComponents.tsx          |  144 ---
 .../BlackJack-v1/components/CardComponents.tsx     |  144 ---
 .../BlackJack-v1/components/CreateGameModal.tsx    |  354 -------
 .../BlackJack-v1/components/DebugGameScreen.tsx    |  609 ------------
 src/games/BlackJack-v1/components/GameScreen.tsx   |  509 ----------
 src/games/BlackJack-v1/components/Lobby.tsx        |  310 ------
 src/games/BlackJack-v1/components/index.tsx        |    4 -
 src/games/BlackJack-v1/constants.ts                |   56 --
 src/games/BlackJack-v1/index.tsx                   |   91 --
 src/games/BlackJack-v1/multiplayer.ts              |   57 --
 src/games/BlackJack-v1/sounds/card.mp3             |  Bin 4248 -> 0 bytes
 src/games/BlackJack-v1/sounds/lose.mp3             |  Bin 21192 -> 0 bytes
 src/games/BlackJack-v1/sounds/play.mp3             |  Bin 17266 -> 0 bytes
 src/games/BlackJack-v1/sounds/win.mp3              |  Bin 9452 -> 0 bytes
 src/games/BlackJack-v1/sounds/win2.mp3             |  Bin 24359 -> 0 bytes
 src/games/BlackJack/index.tsx                      |   74 +-
 src/games/BlackJack/styles.ts                      |   15 +-
 src/games/CrashGame/index.tsx                      |   41 +-
 src/games/CrashGame/styles.ts                      |   40 +-
 src/games/Dice/DiceBackground.enhanced.styles.ts   |   34 +-
 src/games/Dice/index.tsx                           |   39 +-
 src/games/Dice/styles.ts                           |    8 +-
 .../Flip-v1/FlipV1Background.enhanced.styles.ts    |  170 ----
 src/games/Flip-v1/components/Coin.tsx              |   70 --
 src/games/Flip-v1/components/CreateGameModal.tsx   |  328 ------
 src/games/Flip-v1/components/DebugGameScreen.tsx   |  434 --------
 src/games/Flip-v1/components/Effect.tsx            |   15 -
 src/games/Flip-v1/components/GameScreen.tsx        |  397 --------
 src/games/Flip-v1/components/Lobby.tsx             |  302 ------
 src/games/Flip-v1/components/index.ts              |    6 -
 src/games/Flip-v1/heads.png                        |  Bin 310164 -> 0 bytes
 src/games/Flip-v1/index.tsx                        |  117 ---
 src/games/Flip-v1/sounds/coin.mp3                  |  Bin 4652 -> 0 bytes
 src/games/Flip-v1/sounds/lose.mp3                  |  Bin 10988 -> 0 bytes
 src/games/Flip-v1/sounds/win.mp3                   |  Bin 9452 -> 0 bytes
 src/games/Flip-v1/star.png                         |  Bin 2056 -> 0 bytes
 src/games/Flip-v1/tails.png                        |  Bin 310248 -> 0 bytes
 src/games/Flip/Coin.tsx                            |   74 +-
 src/games/Flip/FlipBackground.enhanced.styles.ts   |   73 +-
 src/games/Flip/index.tsx                           |  146 +--
 src/games/HiLo/index.tsx                           |   32 +-
 src/games/HiLo/styles.ts                           |   45 +-
 src/games/Mines/index.tsx                          |   51 +-
 src/games/Mines/styles.ts                          |   29 +-
 src/games/Plinko/game.ts                           |   35 +
 src/games/Plinko/index.tsx                         |  351 ++++++-
 src/games/PlinkoRace/components/GameScreen.tsx     |   31 +-
 src/games/PlinkoRace/index.tsx                     |  103 +-
 src/games/ProgressivePoker/PokerCard.tsx           |   37 +-
 src/games/ProgressivePoker/index.tsx               |  187 ++--
 src/games/Roulette/Roulette.styles.ts              |    6 +-
 src/games/Roulette/index.tsx                       |   82 +-
 src/games/Slots/Reel.tsx                           |  110 +--
 src/games/Slots/index.tsx                          |   65 +-
 src/games/allGames.ts                              |   26 -
 src/hooks/useGameplayEffects.ts                    |  196 ++++
 src/sections/Game/Game.tsx                         |    6 +
 63 files changed, 3051 insertions(+), 4744 deletions(-)

Commit: 5273a14
Date: 2025-08-25
Old message: Updated Audit pages
 api/audit/edgeCases.ts                   | 216 +++++++++++++++
 rtp-validation-test.ts                   | 120 ++++++++
 src/games/rtpConfig.ts                   | 133 ++++-----
 src/sections/Dashboard/FairnessAudit.tsx | 459 ++++++++++++++++++++++++++++---
 4 files changed, 819 insertions(+), 109 deletions(-)

Commit: f6f8e3b
Date: 2025-08-25
Old message: Updated Audit's API
 rtp-validation-test.ts | 120 -------------------------------------------------
 1 file changed, 120 deletions(-)

Commit: 7769d9f
Date: 2025-08-25
Old message: Updated Audit's API
 .gitignore | 2 ++
 1 file changed, 2 insertions(+)

Commit: eed99f9
Date: 2025-08-25
Old message: Updated Audit's API
 src/sections/Dashboard/FairnessAudit.tsx | 1193 ++++++++++++++++++++++--------
 1 file changed, 891 insertions(+), 302 deletions(-)

Commit: c7c3756
Date: 2025-08-25
Old message: Updated Audit's API
 src/sections/Dashboard/FairnessAudit.tsx | 13 +++++++++++--
 1 file changed, 11 insertions(+), 2 deletions(-)

Commit: 63e2710
Date: 2025-08-25
Old message: Updated Audit's API
 api/audit/edgeCases.ts                   | 56 ++++++++++++++++++++++++++++----
 src/sections/Dashboard/FairnessAudit.tsx | 14 +++++---
 test-edge-api.js                         | 40 +++++++++++++++++++++++
 3 files changed, 100 insertions(+), 10 deletions(-)

Commit: d338cb2
Date: 2025-08-26
Old message: Updated Audit's API
 api/audit/edgeCases.ts |  28 +++++++---
 rtp-test.mjs           |  96 +++++++++++++++++++++++++++++++++
 src/games/rtpConfig.ts | 144 +++++++++++++++++++++++++++++++------------------
 test-edge-api.js       |  40 --------------
 4 files changed, 211 insertions(+), 97 deletions(-)

Commit: 05c057d
Date: 2025-08-26
Old message: Updated Audit's API
 src/games/rtpConfig.ts | 201 +++++++++++++++++++++++--------------------------
 1 file changed, 93 insertions(+), 108 deletions(-)

Commit: cf33930
Date: 2025-08-26
Old message: Updated Audit's API
 src/games/rtpConfig.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 8d9840b
Date: 2025-08-26
Old message: Updated Audit's API
 rtp-test.mjs           | 96 --------------------------------------------------
 src/games/rtpConfig.ts | 23 ++++++------
 2 files changed, 12 insertions(+), 107 deletions(-)

Commit: 4187533
Date: 2025-08-26
Old message: Updated Audit's API
 src/games/Plinko/game.ts   | 7 ++-----
 src/games/Plinko/index.tsx | 2 +-
 2 files changed, 3 insertions(+), 6 deletions(-)

Commit: 764ef00
Date: 2025-08-26
Old message: Updated Audit's API
 api/audit/edgeCases.ts | 2 +-
 src/games/rtpConfig.ts | 7 ++++---
 2 files changed, 5 insertions(+), 4 deletions(-)

Commit: 68ab656
Date: 2025-08-26
Old message: Updated Audit's API
 api/audit/edgeCases.ts | 2 +-
 src/games/rtpConfig.ts | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)

Commit: cdd9fcf
Date: 2025-08-26
Old message: Updated Audit's API
 api/audit/edgeCases.ts | 27 ++++++++++++++++++++++++---
 1 file changed, 24 insertions(+), 3 deletions(-)

Commit: 8590304
Date: 2025-08-26
Old message: 🎯 FIX: Plinko RTP calculation - use binomial distribution not uniform
 src/sections/Dashboard/FairnessAudit.tsx | 20 ++++++++++++++++++++
 1 file changed, 20 insertions(+)

Commit: 0fb1d6f
Date: 2025-08-26
Old message: Updated Audit's API
 src/sections/Dashboard/FairnessAudit.tsx | 25 ++++++++++++++++++++++---
 1 file changed, 22 insertions(+), 3 deletions(-)

Commit: d999b28
Date: 2025-08-26
Old message: Updated Audit's API
 src/sections/Dashboard/FairnessAudit.tsx | 134 +++++++++++++++++++++++++------
 test-plinko-sample.ts                    |  59 ++++++++++++++
 2 files changed, 168 insertions(+), 25 deletions(-)

Commit: 474a4ab
Date: 2025-08-26
Old message: Updated Audit's API
 test-plinko-sample.ts | 59 ---------------------------------------------------
 1 file changed, 59 deletions(-)

Commit: 507f1f7
Date: 2025-08-26
Old message: Updated Audit's API
 src/sections/Dashboard/FairnessAudit.tsx | 226 +++++++++++++++++++++++++++++++
 1 file changed, 226 insertions(+)

Commit: ff148e5
Date: 2025-08-26
Old message: Updated style for Audit page
 src/sections/Dashboard/FairnessAudit.tsx | 162 +++++++------------------------
 1 file changed, 33 insertions(+), 129 deletions(-)

Commit: 70d0cf1
Date: 2025-08-26
Old message: Updated style for Audit page
 src/App.tsx                              |  19 +---
 src/sections/Dashboard/FairnessAudit.tsx | 160 +++++++++++++++++++------------
 2 files changed, 100 insertions(+), 79 deletions(-)

Commit: 00c6de0
Date: 2025-08-26
Old message: Updated style for Audit page
 src/sections/Dashboard/FairnessAudit.tsx | 7 ++++++-
 1 file changed, 6 insertions(+), 1 deletion(-)

Commit: 4663579
Date: 2025-08-26
Old message: Updated style for Audit page
 src/sections/Dashboard/FairnessAudit.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: a412573
Date: 2025-08-26
Old message: Updated style for Audit page
 package-lock.json |   8 ++++
 package.json      |   1 +
 src/index.tsx     | 110 ++++++++++++++++++------------------------------------
 vite.config.ts    |  88 +++++++++++++++++++++++++++----------------
 4 files changed, 101 insertions(+), 106 deletions(-)

Commit: 92cbe69
Date: 2025-08-26
Old message: integrated JS OBS
 src/App.tsx    | 17 ++++++++++++++
 vite.config.ts | 72 +++++++++++++++++++++++++++++++++++++++++++++++++---------
 2 files changed, 78 insertions(+), 11 deletions(-)

Commit: 801c10b
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 16 ++++++++++++++--
 1 file changed, 14 insertions(+), 2 deletions(-)

Commit: 64bd6fd
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 78 +++++++++++++++++++++++++---------------------------------
 1 file changed, 34 insertions(+), 44 deletions(-)

Commit: df1facf
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 68 ----------------------------------------------------------
 1 file changed, 68 deletions(-)

Commit: 800415a
Date: 2025-08-26
Old message: integrated JS OBS
 src/index.tsx  | 110 ++++++++++++++++++++++++++++++++++++++-------------------
 vite.config.ts |  23 ++++--------
 2 files changed, 79 insertions(+), 54 deletions(-)

Commit: 73e096b
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 84 +++++++++++++++++++++++++++++++++++++++++++++++++++++++---
 1 file changed, 80 insertions(+), 4 deletions(-)

Commit: ba0d4dd
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: e68d1eb
Date: 2025-08-26
Old message: integrated JS OBS
 public/manifest.webmanifest | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)

Commit: 50ac7c5
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 71 ++++++++++++++++++++++++++++++++++++++++++++++++++--------
 1 file changed, 62 insertions(+), 9 deletions(-)

Commit: 55df303
Date: 2025-08-26
Old message: integrated JS OBS
 package-lock.json | 196 +++++++++++++++++++++++++++++++++++++++++++++++++-----
 package.json      |   4 +-
 vite.config.ts    |  88 ++++++++++++------------
 3 files changed, 228 insertions(+), 60 deletions(-)

Commit: 9d1013e
Date: 2025-08-26
Old message: integrated JS OBS
 package-lock.json | 24883 ----------------------------------------------------
 package.json      |    11 +-
 vite.config.ts    |    69 +-
 3 files changed, 49 insertions(+), 24914 deletions(-)

Commit: c7bc8c1
Date: 2025-08-26
Old message: integrated JS OBS
 package-lock.json             | 23344 ++++++++++++++++++++++++++++++++++++++++
 package.json                  |     5 +
 src/App.tsx                   |     4 +-
 src/components/ErrorModal.tsx |     2 +-
 src/index.tsx                 |     4 +
 src/sections/Game/Game.tsx    |     2 +-
 src/utils/audioManager.ts     |   133 +
 src/utils/polyfills.ts        |    94 +
 vite.config.ts                |   127 +-
 9 files changed, 23703 insertions(+), 12 deletions(-)

Commit: 25b5881
Date: 2025-08-26
Old message: integrated JS OBS
 package-lock.json             | 2682 +++++++++++++++++++++++++++++++++++------
 package.json                  |   13 +-
 src/App.tsx                   |    4 +-
 src/components/ErrorModal.tsx |    2 +-
 src/index.tsx                 |    4 -
 src/sections/Game/Game.tsx    |    2 +-
 src/styles.css                |    4 -
 src/utils/audioManager.ts     |  133 --
 src/utils/polyfills.ts        |   94 --
 vite.config.ts                |  129 +-
 10 files changed, 2320 insertions(+), 747 deletions(-)

Commit: a47ded8
Date: 2025-08-26
Old message: integrated JS OBS
 api/audit/edgeCases.ts | 6 +++---
 api/check-dns.ts       | 2 +-
 vite.config.ts         | 2 +-
 3 files changed, 5 insertions(+), 5 deletions(-)

Commit: 8d86116
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: cf45465
Date: 2025-08-26
Old message: integrated JS OBS
 src/components/ExplorerHeader.tsx | 8 ++++----
 src/components/TrollBox.tsx       | 4 ++--
 src/games/rtpConfig.ts            | 2 +-
 3 files changed, 7 insertions(+), 7 deletions(-)

Commit: 34ed8da
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: bead844
Date: 2025-08-26
Old message: integrated JS OBS
 index.html | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: f1c53b1
Date: 2025-08-26
Old message: integrated JS OBS
 vite.config.ts | 23 ++++++++++++-----------
 1 file changed, 12 insertions(+), 11 deletions(-)

Commit: 7488ef6
Date: 2025-08-26
Old message: Udating JS OBS
 vite.config.ts | 103 +++++++++++++++++++++++++++------------------------------
 1 file changed, 49 insertions(+), 54 deletions(-)

Commit: ba6b1d8
Date: 2025-08-26
Old message: Udating JS OBS
 src/App.tsx                   |   2 +-
 src/components/ErrorModal.tsx |   2 +-
 src/sections/Game/Game.tsx    |   2 +-
 vite.config.ts                | 116 ++++++++++++++++++++++++++----------------
 4 files changed, 75 insertions(+), 47 deletions(-)

Commit: 8cbfbe9
Date: 2025-08-26
Old message: Updating JS OBS
 vite.config.ts | 9 +++++----
 1 file changed, 5 insertions(+), 4 deletions(-)

Commit: 9cdcd17
Date: 2025-08-26
Old message: Udated Plinko
 src/components/GameScreenFrame.tsx | 127 +++++++++++++++++++++----------------
 src/games/Plinko/constants.ts      |   3 +-
 src/games/Plinko/game.ts           |  16 +++--
 src/games/Plinko/index.tsx         |  35 +++++-----
 src/games/Slots/Reel.tsx           |  39 ++++++------
 src/games/Slots/utils.ts           |  36 ++++++-----
 src/games/rtpConfig.ts             |  48 ++++++++++++--
 src/index.tsx                      |   6 ++
 vite.config.ts                     |   2 +-
 9 files changed, 190 insertions(+), 122 deletions(-)

Commit: ea2ca36
Date: 2025-08-26
Old message: Updated CrashGame
 src/components/GameplayFrame.tsx |  3 ++-
 src/games/CrashGame/index.tsx    | 47 ++++++++++++++++++++++++++++++----------
 src/games/allGames.ts            |  4 ++--
 3 files changed, 39 insertions(+), 15 deletions(-)

Commit: 4dcb9d8
Date: 2025-08-27
Old message: Small bugfix
 src/games/Plinko/binomialEngine.ts | 176 +++++++++++++++++++++++++++++++++++++
 src/games/Plinko/game.ts           |   2 +-
 src/games/Plinko/index.tsx         |   2 +-
 3 files changed, 178 insertions(+), 2 deletions(-)

Commit: bbbf20c
Date: 2025-08-27
Old message: Small Update to build
 package-lock.json                   | 12802 +++++++++++++++++++++++-----------
 package.json                        |    17 +-
 public/sw.js                        |   210 +
 public/webp/casino.webp             |   Bin 0 -> 36894 bytes
 public/webp/fakemoney.webp          |   Bin 0 -> 1176 bytes
 public/webp/favicon.webp            |   Bin 0 -> 9418 bytes
 public/webp/icon-192.webp           |   Bin 0 -> 10258 bytes
 public/webp/icon-512.webp           |   Bin 0 -> 37818 bytes
 public/webp/overlay-glow.webp       |   Bin 0 -> 66868 bytes
 public/webp/pfp.webp                |   Bin 0 -> 49382 bytes
 public/webp/seo.webp                |   Bin 0 -> 18674 bytes
 public/webp/stuff.webp              |   Bin 0 -> 1504 bytes
 public/webp/user.webp               |   Bin 0 -> 114552 bytes
 scripts/compress-build.mjs          |   136 +
 scripts/optimize-images.mjs         |    95 +
 src/App.tsx                         |     9 +
 src/components/LazyGameLoader.tsx   |    60 +
 src/components/ResponsiveImage.tsx  |    83 +
 src/hooks/useServiceWorker.ts       |    93 +
 src/sections/Dashboard/GameCard.tsx |    37 +-
 src/sections/Game/Game.tsx          |     8 +
 src/utils/imageOptimization.ts      |   100 +
 src/utils/performance.ts            |   105 +
 src/utils/preloading.ts             |    73 +
 vercel.json                         |    26 +
 vite.config.backup.ts               |   280 +
 vite.config.optimized.ts            |   126 +
 vite.config.ts                      |   206 +-
 28 files changed, 10214 insertions(+), 4252 deletions(-)

Commit: 2ddeeb8
Date: 2025-08-27
Old message: Small Update to build
 src/sections/Dashboard/GameCard.tsx | 35 +++++++++++++++++++++++++----------
 1 file changed, 25 insertions(+), 10 deletions(-)

Commit: 071e04d
Date: 2025-08-27
Old message: Small Update to build
 public/webp/games/blackjack-dual.webp    | Bin 0 -> 53132 bytes
 public/webp/games/blackjack.webp         | Bin 0 -> 88344 bytes
 public/webp/games/crash.webp             | Bin 0 -> 120508 bytes
 public/webp/games/dice.webp              | Bin 0 -> 62484 bytes
 public/webp/games/flip-dual.webp         | Bin 0 -> 46154 bytes
 public/webp/games/flip.webp              | Bin 0 -> 95248 bytes
 public/webp/games/hilo.webp              | Bin 0 -> 47422 bytes
 public/webp/games/mines.webp             | Bin 0 -> 44152 bytes
 public/webp/games/plinko-race.webp       | Bin 0 -> 30272 bytes
 public/webp/games/plinko.webp            | Bin 0 -> 63658 bytes
 public/webp/games/poker.webp             | Bin 0 -> 88344 bytes
 public/webp/games/progressive-poker.webp | Bin 0 -> 59660 bytes
 public/webp/games/roulette.webp          | Bin 0 -> 93602 bytes
 public/webp/games/slots.webp             | Bin 0 -> 68796 bytes
 scripts/check-compression.sh             |  33 +++++++++++++++++++++++++
 scripts/convert-game-images.js           |  41 +++++++++++++++++++++++++++++++
 src/sections/Dashboard/GameCard.tsx      |   6 +++--
 vercel.json                              |  31 ++++-------------------
 18 files changed, 83 insertions(+), 28 deletions(-)

Commit: 9ece2ea
Date: 2025-08-27
Old message: Small Update to build
 vercel.json | 5 -----
 1 file changed, 5 deletions(-)

Commit: 2bfe4e5
Date: 2025-08-27
Old message: Small Update to build
 .gitignore                          |  3 +-
 api/check-dns.ts                    | 78 +++++++++++++------------------------
 src/components/ConnectionStatus.tsx | 27 ++++++++++++-
 3 files changed, 54 insertions(+), 54 deletions(-)

Commit: a96172b
Date: 2025-08-27
Old message: Small Update to build
 .gitignore       |  4 ++--
 api/check-dns.ts | 30 ++-------------------------
 api/coingecko.ts | 63 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 src/constants.ts |  8 ++++---
 4 files changed, 72 insertions(+), 33 deletions(-)

Commit: 5e3caf9
Date: 2025-08-27
Old message: Small Update to cache
 api/cache-admin.ts                  |  85 +++++++++++
 api/cache-warmup.ts                 |  78 ++++++++++
 api/chat.ts                         |   4 +-
 api/check-dns.ts                    |   4 +-
 api/coingecko.ts                    |   4 +-
 api/helius.ts                       |   4 +-
 api/xcache-edge.ts                  | 124 +++++++++++++++-
 api/xcacheOnTheFly.ts               | 147 +++++++++++++++----
 src/App.tsx                         |   2 +
 src/components/CacheDebugPanel.tsx  | 275 ++++++++++++++++++++++++++++++++++++
 src/components/ConnectionStatus.tsx |  25 +++-
 src/hooks/useTokenPrices.ts         |  21 ++-
 src/utils/cacheMonitor.ts           | 178 +++++++++++++++++++++++
 13 files changed, 907 insertions(+), 44 deletions(-)

Commit: e41c4f9
Date: 2025-08-27
Old message: Small Update to build
 .npmrc            |     5 +
 package-lock.json | 33661 ++++++++++++++++++----------------------------------
 package.json      |    14 +-
 3 files changed, 11713 insertions(+), 21967 deletions(-)

Commit: b073ed7
Date: 2025-08-27
Old message: Small Update to build
 package-lock.json | 49 ++++++++++++++++++++++++++++++++++++
 package.json      |  5 +++-
 vite.config.ts    | 74 ++++++++++++++++++++++++++++++++++++++++++++++++-------
 3 files changed, 118 insertions(+), 10 deletions(-)

Commit: fe747e4
Date: 2025-08-27
Old message: Small Update to build
 vite.config.ts | 58 +++++++++++++---------------------------------------------
 1 file changed, 13 insertions(+), 45 deletions(-)

Commit: 9de14cf
Date: 2025-08-27
Old message: Small Update to build
 vite.config.ts | 12 +++---------
 1 file changed, 3 insertions(+), 9 deletions(-)

Commit: 2a5b67e
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/CompactReferralLeaderboard.tsx | 271 ++++++++++++++++++++
 src/components/FullReferralLeaderboard.tsx    | 309 +++++++++++++++++++++++
 src/components/PlayerView.tsx                 |   2 +-
 src/components/ReferralDashboard.tsx          | 327 +++++++++++++++++++++++++
 src/components/ReferralLeaderboardModal.tsx   | 339 ++++++++++++++++++++++++++
 src/constants.ts                              |   8 +
 src/hooks/useReferralAnalytics.ts             |  65 +++++
 src/sections/Dashboard/Dashboard.tsx          |  82 +++++--
 src/sections/TokenSelect.tsx                  | 195 ++++++++++++++-
 src/sections/UserProfile.tsx                  |  35 ++-
 src/utils/referralTier.ts                     |  76 ++++++
 11 files changed, 1673 insertions(+), 36 deletions(-)

Commit: 0cec172
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/constants.ts | 21 ++++++++++++++++-----
 1 file changed, 16 insertions(+), 5 deletions(-)

Commit: 05dad1f
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/PlatformView.tsx | 92 ++++++++++++++++++++++++++++++-----------
 src/components/Transaction.tsx  | 47 +++++++++++++++------
 2 files changed, 102 insertions(+), 37 deletions(-)

Commit: 9d23a06
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/PlatformView.tsx | 284 +++++++++++++++++++++++-----------------
 1 file changed, 164 insertions(+), 120 deletions(-)

Commit: 6876d49
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/PlatformView.tsx | 40 +++++++++++++++++++++++++++++++++++-----
 1 file changed, 35 insertions(+), 5 deletions(-)

Commit: 89d0bc4
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/Transaction.tsx | 183 +++++++++++++++--------------------------
 1 file changed, 65 insertions(+), 118 deletions(-)

Commit: c5a6e81
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/Transaction.tsx | 410 +++++++++++++++++++++++++----------------
 1 file changed, 255 insertions(+), 155 deletions(-)

Commit: ec00d7b
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/FullReferralLeaderboard.tsx | 15 ++++++++++-----
 src/hooks/useUserStore.ts                  |  3 +++
 src/sections/TokenSelect.tsx               |  5 +++--
 src/sections/UserButton.tsx                |  8 ++++++--
 4 files changed, 22 insertions(+), 9 deletions(-)

Commit: 2b4c9c6
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/components/CompactReferralLeaderboard.tsx |  4 +-
 src/components/FullReferralLeaderboard.tsx    |  4 +-
 src/components/ReferralDashboard.tsx          | 17 ++++++---
 src/components/ReferralLeaderboardModal.tsx   |  4 +-
 src/constants.ts                              | 41 ++++++++++++--------
 src/sections/TokenSelect.tsx                  | 25 ++++++++++---
 src/utils/referralTier.ts                     | 54 ++++++++++++++++++++++++---
 7 files changed, 111 insertions(+), 38 deletions(-)

Commit: 9a9daf6
Date: 2025-08-27
Old message: Major updare to the Referrals system
 src/games/rtpConfig.ts | 30 +++++++++++++++---------------
 1 file changed, 15 insertions(+), 15 deletions(-)

Commit: 1621f17
Date: 2025-08-27
Old message: Temporarily removed JS OBS
 public/games/lootbox.png         | Bin 0 -> 1690629 bytes
 src/components/GameplayFrame.tsx |   1 +
 src/games/Flip/styles.ts         |   0
 3 files changed, 1 insertion(+)

Commit: 7cd62f6
Date: 2025-08-27
Old message: Temporarily removed JS OBS
 src/constants.ts | 15 ++++++---------
 1 file changed, 6 insertions(+), 9 deletions(-)

Commit: 33fc660
Date: 2025-08-28
Old message: Temporarily removed JS OBS
 src/constants.ts | 8 ++++----
 1 file changed, 4 insertions(+), 4 deletions(-)

Commit: 97c073f
Date: 2025-08-28
Old message: Temporarily removed JS OBS
 src/components/GameScreenFrame.tsx | 477 ++++++++++++++++---------------------
 1 file changed, 201 insertions(+), 276 deletions(-)

Commit: 43345dd
Date: 2025-08-29
Old message: Temporarily removed JS OBS
 readme.md | 291 +++++++++++++++++++++-----------------------------------------
 1 file changed, 100 insertions(+), 191 deletions(-)

Commit: d53e714
Date: 2025-08-29
Old message: Updating mobile layout, expect bugs.
 src/App.tsx                                    |  22 +--
 src/components/AllGamesModalContent.tsx        | 211 +++++++++++++++++--------
 src/components/BonusModal.tsx                  |   4 +-
 src/components/ConnectionStatus.tsx            | 144 ++++++++++++-----
 src/components/ErrorModal.tsx                  |  10 ++
 src/components/JackpotModal.tsx                | 174 ++++++++++----------
 src/components/Modal.tsx                       |  20 ++-
 src/components/ReferralLeaderboardModal.tsx    |   3 +
 src/games/Mines/index.tsx                      |   2 +-
 src/games/Mines/styles.ts                      |  12 +-
 src/hooks/useUserStore.ts                      |   1 +
 src/pages/JackpotPage.tsx                      | 126 +++++++++++++++
 src/pages/LeaderboardPage.tsx                  | 140 ++++++++++++++++
 src/pages/SelectTokenPage.tsx                  | 163 +++++++++++++++++++
 src/sections/Header.tsx                        |   9 +-
 src/sections/LeaderBoard/LeaderboardsModal.tsx | 124 ++++++++-------
 src/sections/TokenSelect.tsx                   |   2 +-
 src/sections/UserButton.tsx                    |   6 +-
 src/styles.css                                 |   4 +-
 19 files changed, 893 insertions(+), 284 deletions(-)

Commit: 015b788
Date: 2025-08-30
Old message: Updating mobile layout.
 src/App.tsx                             |  13 +-
 src/components/AllGamesModalContent.tsx | 213 +++++++++--------------------
 src/components/ConnectionStatus.tsx     | 146 ++++++--------------
 src/components/Modal.tsx                |  40 +++---
 src/components/Sidebar.tsx              |  32 +----
 src/constants.ts                        |  24 ++++
 src/games/allGames.ts                   |  12 --
 src/sections/Dashboard/Dashboard.tsx    |  65 +++++++--
 src/sections/Dashboard/GameCard.tsx     |  46 +------
 src/sections/Footer.tsx                 | 231 +++++++-------------------------
 10 files changed, 265 insertions(+), 557 deletions(-)

Commit: eda6e39
Date: 2025-08-30
Old message: Updating mobile layout.
 src/constants.ts | 48 ++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 48 insertions(+)

Commit: f4ea5d1
Date: 2025-08-30
Old message: Updating mobile layout.
 src/constants.ts | 5 +----
 1 file changed, 1 insertion(+), 4 deletions(-)

Commit: f3af40f
Date: 2025-08-30
Old message: Updating mobile layout.
 src/sections/Footer.tsx | 16 ++++++++++------
 1 file changed, 10 insertions(+), 6 deletions(-)

Commit: ab3fe31
Date: 2025-08-30
Old message: Updating mobile layout.
 src/constants.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 02d07f1
Date: 2025-08-30
Old message: Updating mobile layout.
 src/components/JackpotModal.tsx | 50 ++++++++++++++++++++++-------------------
 1 file changed, 27 insertions(+), 23 deletions(-)

Commit: f707ac5
Date: 2025-08-30
Old message: Updating Modal displays.
 src/App.tsx                                        | 245 +++----
 src/components/AllGamesModalContent.tsx            |   2 +-
 src/components/BonusModal.tsx                      |  62 +-
 src/components/ConnectionStatus.tsx                |   2 +-
 src/components/Dropdown.tsx                        |   9 +-
 src/components/EmbeddedTransaction.tsx             |  57 +-
 src/components/ErrorModal.tsx                      |   6 +-
 src/components/ExplorerHeader.tsx                  |  19 +-
 src/components/Modal.tsx                           |  48 +-
 src/components/PlatformView.tsx                    | 218 +++---
 src/components/PlayerView.tsx                      | 152 ++--
 src/components/Sidebar.tsx                         |  34 +-
 src/components/Slider.tsx                          |   4 +-
 src/components/ThemeSelector.tsx                   | 124 ++++
 src/components/TrollBox.tsx                        |  90 +--
 src/pages/BonusPage.tsx                            | 128 ++++
 src/pages/JackpotPage.tsx                          |  42 +-
 src/pages/LeaderboardPage.tsx                      |  65 +-
 src/pages/SelectTokenPage.tsx                      |  58 +-
 src/pages/propagation.tsx                          | 130 ++--
 src/sections/Dashboard/Dashboard.tsx               | 248 ++++---
 src/sections/Dashboard/WelcomeBanner.tsx           | 325 +++++----
 src/sections/Footer.tsx                            |  44 +-
 src/sections/Game/ProvablyFairModal.tsx            |   6 +-
 src/sections/Game/TransactionModal.tsx             |   9 +-
 src/sections/Header.tsx                            | 151 ++--
 .../LeaderBoard/LeaderboardsModal.styles.ts        | 138 ++--
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |  28 +-
 src/sections/LeaderBoard/Modal.tsx                 |   4 +-
 src/sections/RecentPlays/ShareModal.tsx            |  18 +-
 src/sections/UserProfile.tsx                       |  24 +-
 src/themes/ThemeContext.tsx                        | 111 +++
 src/themes/globalThemes.ts                         | 772 +++++++++++++++++++++
 src/themes/themeUtils.ts                           | 191 +++++
 34 files changed, 2530 insertions(+), 1034 deletions(-)

Commit: 8e688c6
Date: 2025-08-30
Old message: Updating Modal displays.
 package-lock.json                                  |  10 +
 package.json                                       |   1 +
 src/components/AllGamesModalContent.tsx            |  96 +++--
 src/components/BonusModal.tsx                      | 213 ++++------
 src/components/JackpotModal.tsx                    | 351 ++++++----------
 src/components/Modal.tsx                           | 344 ++++++++--------
 src/components/ReferralLeaderboardModal.tsx        | 448 ++++++++++++++-------
 src/components/ShareModal.tsx                      | 378 +++++++++++++++++
 .../LeaderBoard/LeaderboardsModal.styles.ts        | 226 ++++++-----
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |   5 +-
 src/sections/LeaderBoard/Modal.tsx                 | 163 +++++---
 src/sections/RecentPlays/RecentPlays.styles.ts     | 149 +++++--
 src/sections/RecentPlays/RecentPlays.tsx           | 309 ++++++++++++--
 src/sections/RecentPlays/ShareModal.tsx            | 214 ----------
 src/sections/TokenSelect.tsx                       |   9 +-
 src/sections/UserButton.tsx                        |   5 +-
 16 files changed, 1745 insertions(+), 1176 deletions(-)

Commit: c5318bc
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/MobileControls.tsx                | 452 +++++++++++++++++++++--
 src/components/Modal.tsx                         |   1 -
 src/games/HiLo/HiLoBackground.enhanced.styles.ts |  10 +-
 src/games/HiLo/index.tsx                         | 319 +++++++++++++---
 src/games/HiLo/styles.ts                         |   2 +-
 src/games/Mines/index.tsx                        |  11 +-
 src/games/ProgressivePoker/index.tsx             |  34 +-
 src/games/rtpConfig.ts                           |  18 +-
 src/sections/LeaderBoard/Modal.tsx               |   1 -
 9 files changed, 740 insertions(+), 108 deletions(-)

Commit: a167465
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/MobileControls.tsx                  |   2 +-
 .../BlackjackBackground.enhanced.styles.ts         | 663 ++++++++++++++++-----
 src/games/Flip/FlipBackground.enhanced.styles.ts   | 115 +++-
 src/games/Flip/index.tsx                           |  27 -
 src/games/HiLo/styles.ts                           | 137 +++++
 src/games/Mines/styles.ts                          | 106 ++++
 .../Plinko/PlinkoBackground.enhanced.styles.ts     | 146 ++++-
 .../PlinkoRaceBackground.enhanced.styles.ts        | 151 ++++-
 .../ProgressiveBackground.enhanced.styles.ts       | 147 ++++-
 src/games/Roulette/Roulette.styles.ts              | 116 ++++
 src/games/Slots/Slots.styles.ts                    |  79 ++-
 src/sections/Game/Game.styles.ts                   | 139 ++++-
 12 files changed, 1591 insertions(+), 237 deletions(-)

Commit: 46a80f6
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 359 ++++++++++++++++++++++++++++++++--------
 1 file changed, 293 insertions(+), 66 deletions(-)

Commit: 061d9f4
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 9d9a1f2
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 15 ++++++++++++++-
 1 file changed, 14 insertions(+), 1 deletion(-)

Commit: 1850e14
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 19 ++++++++++++++++---
 1 file changed, 16 insertions(+), 3 deletions(-)

Commit: a9fd048
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 84 +++++++++++++++++++++++------------------
 1 file changed, 47 insertions(+), 37 deletions(-)

Commit: cefcd26
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 7 +++++--
 1 file changed, 5 insertions(+), 2 deletions(-)

Commit: 84769c4
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 98 ++++++++++++++++++++++++++++++-----------
 1 file changed, 72 insertions(+), 26 deletions(-)

Commit: 4522556
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 165 ++++++++++++++++++++++------------------
 1 file changed, 89 insertions(+), 76 deletions(-)

Commit: 8ee7e32
Date: 2025-08-31
Old message: Updating Modal displays.
 src/components/JackpotModal.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: bd45b40
Date: 2025-08-31
Old message: Updating Modal displays.
 package-lock.json               |  11 +
 package.json                    |   2 +
 src/components/JackpotModal.tsx | 457 ++++++----------------------------------
 3 files changed, 79 insertions(+), 391 deletions(-)

Commit: e5788e2
Date: 2025-08-31
Old message: Updating Compression SiteWide
 index.html                                 |   7 ++-
 public/webp/games/lootbox.webp             | Bin 0 -> 68796 bytes
 src/App.tsx                                |  88 +++++++++++++++++------------
 src/games/CrashGame/rocket.webp            | Bin 0 -> 904948 bytes
 src/games/CrashGame/styles.ts              |   2 +-
 src/games/Slots/assets/slot-bonk.webp      | Bin 0 -> 14868 bytes
 src/games/Slots/assets/slot-dghrt.webp     | Bin 0 -> 42808 bytes
 src/games/Slots/assets/slot-jup.webp       | Bin 0 -> 7522 bytes
 src/games/Slots/assets/slot-legendary.webp | Bin 0 -> 123642 bytes
 src/games/Slots/assets/slot-mythical.webp  | Bin 0 -> 130430 bytes
 src/games/Slots/assets/slot-sol.webp       | Bin 0 -> 9058 bytes
 src/games/Slots/assets/slot-unicorn.webp   | Bin 0 -> 27296 bytes
 src/games/Slots/assets/slot-usdc.webp      | Bin 0 -> 5534 bytes
 src/games/Slots/assets/slot-wojak.webp     | Bin 0 -> 22748 bytes
 src/games/Slots/constants.ts               |  16 +++---
 src/games/allGames.ts                      |  10 ++--
 src/hooks/useServiceWorker.ts              |   4 +-
 vite.config.ts                             |  75 +++++++++++++++++++-----
 18 files changed, 135 insertions(+), 67 deletions(-)

Commit: 5eeda15
Date: 2025-08-31
Old message: Updating Compression SiteWide
 vite.config.backup.ts    | 280 -----------------------------------------------
 vite.config.optimized.ts | 126 ---------------------
 2 files changed, 406 deletions(-)

Commit: b831b92
Date: 2025-08-31
Old message: Updating Compression SiteWide
 index.html            |   6 +--
 src/games/allGames.ts | 146 --------------------------------------------------
 2 files changed, 1 insertion(+), 151 deletions(-)

Commit: 2905971
Date: 2025-08-31
Old message: Updating Compression SiteWide
 index.html            |   6 ++-
 src/games/allGames.ts | 146 ++++++++++++++++++++++++++++++++++++++++++++++++++
 src/index.tsx         |  19 +++----
 vite.config.ts        |  70 ++++++------------------
 4 files changed, 174 insertions(+), 67 deletions(-)

Commit: eeba53e
Date: 2025-08-31
Old message: Updating Compression SiteWide
 src/games/allGames.ts | 12 ++++++------
 1 file changed, 6 insertions(+), 6 deletions(-)

Commit: edc1c3c
Date: 2025-08-31
Old message: Updating Compression SiteWide
 src/components/ShareModal.tsx       |   2 +-
 src/components/Sidebar.tsx          |   2 +-
 src/components/Transaction.tsx      |  10 +++++-----
 src/games/Flip/Coin.tsx             |   4 ++--
 src/games/Flip/Effect.tsx           |   2 +-
 src/games/Flip/heads.webp           | Bin 0 -> 42808 bytes
 src/games/Flip/star.webp            | Bin 0 -> 1098 bytes
 src/games/Flip/tails.webp           | Bin 0 -> 42818 bytes
 src/sections/Dashboard/AboutMe.tsx  |   2 +-
 src/sections/Dashboard/GameCard.tsx |   2 +-
 src/sections/Header.tsx             |   2 +-
 src/sections/UserProfile.tsx        |   2 +-
 12 files changed, 14 insertions(+), 14 deletions(-)

Commit: d6ea9ae
Date: 2025-08-31
Old message: Updating Compression SiteWide
 src/sections/LeaderBoard/LeaderboardsModal.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: ae2f289
Date: 2025-09-01
Old message: Updating Flip, Mines, HiLo & ProgressivePoker Games
 src/games/Flip/Coin.tsx                          |  42 ++++--
 src/games/Flip/FlipBackground.enhanced.styles.ts |  97 +++++++-----
 src/games/Flip/index.tsx                         | 182 ++++++++++++++++++++---
 src/games/rtpConfig.ts                           |  68 ++++++++-
 4 files changed, 312 insertions(+), 77 deletions(-)

Commit: 27e1de8
Date: 2025-09-01
Old message: Reorganising Workspace
 src/App.tsx                                        |   10 +-
 src/components/CompactReferralLeaderboard.tsx      |    2 +-
 src/components/FullReferralLeaderboard.tsx         |    2 +-
 src/components/ReferralDashboard.tsx               |    2 +-
 src/components/ReferralLeaderboardModal.tsx        |    2 +-
 src/components/TrollBox.tsx                        |    2 +-
 src/games/allGames.ts                              |    2 +-
 .../{AboutMe.tsx => AboutMe/AboutMe.styles.ts}     |   98 +-
 src/sections/Dashboard/AboutMe/AboutMe.tsx         |   71 +
 src/sections/Dashboard/Dashboard.styles.ts         |  374 +++++
 src/sections/Dashboard/Dashboard.tsx               |  395 +-----
 src/sections/Dashboard/FairnessAudit.tsx           | 1470 ++------------------
 .../FeaturedGameCard.styles.ts}                    |   28 +-
 .../FeaturedGameCard/FeaturedGameCard.tsx          |   25 +
 .../FeaturedInlineGame.styles.ts                   |   29 +
 .../FeaturedInlineGame.tsx                         |   40 +-
 src/sections/Dashboard/GameCard.styles.ts          |  152 ++
 src/sections/Dashboard/GameCard.tsx                |  150 +-
 src/sections/Dashboard/Terms/Terms.styles.ts       |  224 +++
 src/sections/Dashboard/{ => Terms}/Terms.tsx       |  227 +--
 .../WelcomeBanner.styles.ts}                       |  200 +--
 .../Dashboard/WelcomeBanner/WelcomeBanner.tsx      |  103 ++
 .../Dashboard/Whitepaper/Whitepaper.styles.ts      |  162 +++
 .../Dashboard/{ => Whitepaper}/Whitepaper.tsx      |  205 +--
 src/sections/FairnessAudit/FairnessAudit.styles.ts | 1050 ++++++++++++++
 src/sections/FairnessAudit/FairnessAudit.tsx       |  849 +++++++++++
 src/sections/TokenSelect.tsx                       |    2 +-
 src/sections/UserProfile/UserProfile.styles.ts     |  220 +++
 src/sections/{ => UserProfile}/UserProfile.tsx     |  245 +---
 src/{sections => utils}/userProfileUtils.ts        |    0
 30 files changed, 3460 insertions(+), 2881 deletions(-)

Commit: e39ea93
Date: 2025-09-01
Old message: Updated Accessabilities settings
 src/games/rtpConfig.ts | 3 ++-
 1 file changed, 2 insertions(+), 1 deletion(-)

Commit: a6555b4
Date: 2025-09-02
Old message: Updated Accessabilities settings
 src/components/EnhancedGameControls.tsx |  88 ++++++++++++++++--
 src/components/MobileControls.tsx       | 128 +++++++++++++++++++++++---
 src/components/PriceIndicator.tsx       | 153 ++++++++++++++++++++++++++++++++
 src/services/TokenPriceService.ts       |   8 ++
 4 files changed, 356 insertions(+), 21 deletions(-)

Commit: b2554d0
Date: 2025-09-02
Old message: Updated Accessabilities settings
 src/components/JackpotModal.tsx |   3 +
 src/components/PoolWinners.tsx  | 235 ++++++++++++++++++++++++++++++++++++++++
 2 files changed, 238 insertions(+)

Commit: 164a2dc
Date: 2025-09-02
Old message: Updated Accessabilities settings
 src/components/PoolWinners.tsx | 50 ++++++++++++++++++++++++++++++++++--------
 1 file changed, 41 insertions(+), 9 deletions(-)

Commit: 60c1bab
Date: 2025-09-02
Old message: Updated Accessabilities settings
 src/components/PoolWinners.tsx | 12 ++++++++++++
 1 file changed, 12 insertions(+)

Commit: c367b21
Date: 2025-09-02
Old message: Updated Accessabilities settings
 src/components/JackpotModal.tsx |   3 -
 src/components/PoolWinners.tsx  | 279 ----------------------------------------
 2 files changed, 282 deletions(-)

Commit: eb767b6
Date: 2025-09-02
Old message: Updated Accessabilities settings
 src/games/Plinko/BucketScoreboard.tsx    | 315 +++++++++++++++++++++++++++++++
 src/games/Plinko/index.tsx               |  43 +++++
 src/games/PlinkoRace/engine/constants.ts |   2 +-
 src/games/PlinkoRace/index.tsx           | 305 ++++++++++++++++++++++++------
 src/games/allGames.ts                    |   2 +-
 5 files changed, 605 insertions(+), 62 deletions(-)

Commit: 09a61c1
Date: 2025-09-02
Old message: Updated Scoreboard on PlinkoRace
 src/games/PlinkoRace/board/Scoreboard.tsx | 537 ++++++++++++++++++++++--------
 1 file changed, 390 insertions(+), 147 deletions(-)

Commit: fddffb1
Date: 2025-09-03
Old message: Updated Scoreboard on PlinkoRace
 analyze-remaining.sh                               |  82 +++++++
 auto-extract-styles.sh                             | 120 ++++++++++
 create-component-styles.sh                         | 116 +++++++++
 extract-styles-batch.sh                            | 115 +++++++++
 fix-imports.sh                                     | 125 ++++++++++
 src/App.tsx                                        |  15 +-
 src/GlobalErrorBoundary.tsx                        |   2 +-
 .../AllGamesModal.styles.ts}                       |  96 ++------
 src/components/AllGamesModal/AllGamesModal.tsx     |  67 ++++++
 .../{BonusModal.tsx => Bonus/Bonus.styles.ts}      |  77 +-----
 src/components/Bonus/BonusModal.tsx                |  67 ++++++
 src/components/Cache/Cache.styles.ts               | 109 +++++++++
 src/components/{ => Cache}/CacheDebugPanel.tsx     | 124 ++--------
 src/components/Connection/Connection.styles.ts     | 244 +++++++++++++++++++
 .../{ => Connection}/ConnectionStatus.tsx          | 258 +--------------------
 .../{ => Connection}/PropagationStatus.tsx         |   0
 src/components/Dropdown/Dropdown.styles.ts         |  13 ++
 src/components/{ => Dropdown}/Dropdown.tsx         |   2 +-
 src/components/Explorer/Explorer.styles.ts         |  13 ++
 src/components/{ => Explorer}/ExplorerHeader.tsx   |   4 +-
 src/components/{ => Explorer}/ExplorerIndex.tsx    |   4 +-
 src/components/{ => Game}/EnhancedGameControls.tsx |   6 +-
 src/components/Game/Game.styles.ts                 |  13 ++
 src/components/{ => Game}/GameScreenFrame.tsx      |   0
 src/components/{ => Game}/GameSplashScreen.tsx     |   0
 src/components/{ => Game}/GameplayFrame.tsx        |   6 +-
 src/components/{ => Game}/LazyGameLoader.tsx       |  24 +-
 src/components/Graphics/Graphics.styles.ts         |  13 ++
 src/components/{ => Graphics}/GraphicsSettings.tsx |   2 +-
 src/components/Jackpot/Jackpot.styles.ts           |  13 ++
 src/components/{ => Jackpot}/JackpotModal.tsx      |   4 +-
 src/components/Mobile/Mobile.styles.ts             |  13 ++
 src/components/{ => Mobile}/MobileControls.tsx     |   4 +-
 src/components/{ => Mobile}/MobileGameControls.tsx |   2 +-
 src/components/Modal.tsx                           | 208 -----------------
 src/components/{ => Modal}/ErrorModal.tsx          |   2 +-
 src/components/Modal/Modal.styles.ts               | 127 ++++++++++
 src/components/Modal/Modal.tsx                     |  94 ++++++++
 src/components/Platform/Platform.styles.ts         |  13 ++
 src/components/{ => Platform}/PlatformView.tsx     |  10 +-
 src/components/{ => Platform}/PlayerView.tsx       |   6 +-
 .../{ => Referral}/CompactReferralLeaderboard.tsx  |   8 +-
 .../{ => Referral}/FullReferralLeaderboard.tsx     |  10 +-
 src/components/Referral/Referral.styles.ts         |  13 ++
 .../{ => Referral}/ReferralDashboard.tsx           |  10 +-
 .../{ => Referral}/ReferralLeaderboardModal.tsx    |  10 +-
 src/components/Share/Share.styles.ts               |  13 ++
 src/components/{ => Share}/ShareModal.tsx          |   8 +-
 src/components/Theme/Theme.styles.ts               |  13 ++
 src/components/{ => Theme}/ThemeSelector.tsx       |   4 +-
 .../{ => Transaction}/EmbeddedTransaction.tsx      |   2 +-
 src/components/{ => Transaction}/FeesTab.tsx       |   0
 src/components/Transaction/Transaction.styles.ts   |  13 ++
 src/components/{ => Transaction}/Transaction.tsx   |   6 +-
 src/components/{ => UI}/EnhancedTickerTape.tsx     |   4 +-
 src/components/{ => UI}/Icon.tsx                   |   0
 src/components/{ => UI}/PriceIndicator.tsx         |   2 +-
 src/components/{ => UI}/ResponsiveImage.tsx        |   0
 src/components/{ => UI}/Sidebar.tsx                |   4 +-
 src/components/{ => UI}/Slider.tsx                 |   0
 src/components/{ => UI}/TrollBox.tsx               |   6 +-
 src/components/UI/UI.styles.ts                     |  13 ++
 src/components/casino/CasinoAmbientFX.tsx          |  66 ------
 src/components/casino/PhysicsChips.tsx             |   0
 src/components/index.tsx                           |  85 ++++++-
 src/games/Roulette/index.tsx                       |   4 +-
 src/hooks/useGameplayEffects.ts                    |   2 +-
 src/pages/BonusPage.tsx                            |   2 +-
 src/pages/JackpotPage.tsx                          |   2 +-
 src/sections/Dashboard/Dashboard.tsx               |   4 +-
 src/sections/Footer.tsx                            |   2 +-
 src/sections/Game/Game.tsx                         |   5 +-
 src/sections/Game/ProvablyFairModal.tsx            |   4 +-
 src/sections/Game/TransactionModal.tsx             |   2 +-
 src/sections/Header.tsx                            |   6 +-
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |   2 +-
 src/sections/RecentPlays/RecentPlays.tsx           |   4 +-
 src/sections/TokenSelect.tsx                       |   2 +-
 src/sections/UserButton.tsx                        |   2 +-
 79 files changed, 1644 insertions(+), 902 deletions(-)

Commit: e797035
Date: 2025-09-03
Old message: Updated Scoreboard on PlinkoRace
 src/games/BlackJack/index.tsx                  | 4 ++--
 src/games/CrashGame/index.tsx                  | 4 ++--
 src/games/Dice/index.tsx                       | 4 ++--
 src/games/Flip/index.tsx                       | 4 ++--
 src/games/HiLo/index.tsx                       | 4 ++--
 src/games/Mines/index.tsx                      | 4 ++--
 src/games/Plinko/index.tsx                     | 2 +-
 src/games/PlinkoRace/components/GameScreen.tsx | 2 +-
 src/games/PlinkoRace/index.tsx                 | 2 +-
 src/games/ProgressivePoker/index.tsx           | 4 ++--
 src/games/Slots/index.tsx                      | 4 ++--
 11 files changed, 19 insertions(+), 19 deletions(-)

Commit: bebc71d
Date: 2025-09-03
Old message: Integrated low network support
 src/App.tsx                                        | 192 +++++++--
 src/components/Ambient.tsx                         |   0
 src/components/Dev/AdaptiveFpsOverlay.tsx          |  68 +++
 src/components/Game/GameSplashScreen.tsx           |  33 +-
 src/components/Modal/Modal.tsx                     |  20 +-
 src/components/Settings/SettingsModal.tsx          | 465 +++++++++++++++++++++
 src/components/Share/ShareModal.tsx                |   3 +-
 src/components/Theme/ThemeSelector.tsx             |  36 +-
 src/components/UI/EnhancedTickerTape.tsx           |  36 +-
 src/components/UI/ResponsiveImage.tsx              |  49 +--
 src/components/UI/Sidebar.tsx                      |   3 +-
 src/components/UI/SmartImage.tsx                   |  71 ++++
 src/constants.ts                                   |  24 --
 src/games/Flip/index.tsx                           |   5 +-
 src/games/Plinko/game.ts                           |   9 +-
 .../PlinkoRace/components/LobbyBackground.tsx      |  11 +-
 src/games/PlinkoRace/engine/SimulationEngine.ts    |   5 +-
 src/games/Slots/Reel.tsx                           |   7 +-
 src/hooks/useGameplayEffects.ts                    |  16 +-
 src/hooks/usePrefetch.ts                           | 217 ++++++++++
 src/hooks/useServiceWorker.ts                      |  28 ++
 src/hooks/useUserStore.ts                          |  45 ++
 src/sections/Dashboard/Dashboard.styles.ts         |   7 +-
 src/sections/Dashboard/Dashboard.tsx               |   4 +-
 src/sections/Dashboard/GameCard.tsx                |  60 +--
 src/sections/Header.tsx                            |  66 ++-
 src/sections/RecentPlays/RecentPlays.tsx           |  19 +-
 src/sections/UserButton.tsx                        |  19 +-
 src/sections/UserProfile/UserProfile.tsx           |  33 +-
 src/styles.css                                     |  24 ++
 src/utils/performance.ts                           |  15 +-
 src/utils/rafScheduler.ts                          |  91 ++++
 vite.config.ts                                     |   2 +
 33 files changed, 1395 insertions(+), 288 deletions(-)

Commit: 3b765fc
Date: 2025-09-03
Old message: Integrated low network support
 src/components/Bonus/Bonus.styles.ts | 36 ------------------------------------
 src/components/Bonus/BonusModal.tsx  |  6 ------
 2 files changed, 42 deletions(-)

Commit: 6ffdc13
Date: 2025-09-03
Old message: Integrated low network support
 src/components/Settings/SettingsModal.tsx | 23 ++++++++++++++++++++---
 1 file changed, 20 insertions(+), 3 deletions(-)

Commit: 880f151
Date: 2025-09-04
Old message: Integrated low network support
 src/App.tsx                                        |  13 +
 src/components/Cache/CacheDebugPanel.tsx           | 262 +++++++++------------
 src/components/Debug/CacheDebug.tsx                | 151 ++++++++++++
 src/components/Platform/PlatformView.tsx           |  57 +++--
 src/components/Platform/PlayerView.tsx             |  29 ++-
 src/contexts/RefreshContext.tsx                    |  45 ++++
 src/hooks/useLeaderboardData.ts                    |  46 +++-
 .../LeaderBoard/LeaderboardsModal.styles.ts        |  74 +++++-
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |  61 ++++-
 .../LeaderBoard/LeaderboardsModal_backup.tsx       | 198 ++++++++++++++++
 src/sections/RecentPlays/RecentPlays.tsx           |   2 +-
 src/sections/RecentPlays/useRecentPlays.ts         |  65 ++++-
 src/sections/RecentPlays/useRecentPlays.ts.backup  |  87 +++++++
 src/utils/cache.ts                                 | 106 +++++++++
 src/utils/prefetch.ts                              | 176 ++++++++++++++
 15 files changed, 1175 insertions(+), 197 deletions(-)

Commit: dea8aaa
Date: 2025-09-04
Old message: Integrated low network support
 src/components/Platform/PlatformView.tsx | 116 ++++++++++++++++++++++---------
 src/utils/prefetch.ts                    |  12 ++--
 2 files changed, 90 insertions(+), 38 deletions(-)

Commit: 5a58583
Date: 2025-09-04
Old message: Integrated low network support
 src/components/Platform/PlatformView.tsx | 17 +++++++++++++----
 src/utils/prefetch.ts                    | 14 ++++++++++++--
 2 files changed, 25 insertions(+), 6 deletions(-)

Commit: 4003cfb
Date: 2025-09-04
Old message: Integrated low network support
 gamba-api-investigation.js               | 156 +++++++++++++++++++++++++++
 src/components/Ambient.tsx               |   0
 src/components/Platform/PlatformView.tsx | 176 ++++++++++++-------------------
 src/constants.ts                         |   2 +-
 src/utils/prefetch.ts                    |  14 +--
 5 files changed, 226 insertions(+), 122 deletions(-)

Commit: 97e6906
Date: 2025-09-04
Old message: Integrated low network support
 extract-remaining-styles.sh                        |  46 +++
 src/components/Settings/Settings.styles.ts         | 228 +++++++++++
 src/components/Settings/SettingsModal.tsx          | 442 +++++----------------
 src/sections/Dashboard/FairnessAudit.tsx           |  33 +-
 src/sections/FairnessAudit/FairnessAudit.styles.ts |  16 +-
 src/sections/FairnessAudit/FairnessAudit.tsx       |  33 +-
 src/sections/Footer.styles.ts                      | 354 +++++++++++++++++
 src/sections/Footer.tsx                            | 240 +----------
 src/sections/Header.styles.ts                      | 213 ++++++++++
 src/sections/Header.tsx                            | 258 +-----------
 .../LeaderBoard/LeaderboardsModal.styles.ts        |   8 +-
 .../LeaderBoard/LeaderboardsModal_backup.tsx       | 198 ---------
 src/sections/Toasts.styles.ts                      | 242 +++++++++++
 src/sections/Toasts.tsx                            | 255 +-----------
 src/sections/TokenSelect.styles.ts                 | 390 ++++++++++++++++++
 src/sections/TokenSelect.tsx                       | 124 +-----
 src/sections/UserButton.styles.ts                  | 266 +++++++++++++
 src/sections/UserButton.tsx                        | 275 +------------
 vite.config.ts                                     |  13 +-
 19 files changed, 1978 insertions(+), 1656 deletions(-)

Commit: 46ba8b8
Date: 2025-09-04
Old message: Integrated low network support
 analyze-remaining.sh        |  82 -----------------------
 auto-extract-styles.sh      | 120 ----------------------------------
 create-component-styles.sh  | 116 --------------------------------
 extract-remaining-styles.sh |  46 -------------
 extract-styles-batch.sh     | 115 --------------------------------
 fix-imports.sh              | 125 -----------------------------------
 gamba-api-investigation.js  | 156 --------------------------------------------
 7 files changed, 760 deletions(-)

Commit: 6b88d57
Date: 2025-09-04
Old message: Integrated low network support
 package-lock.json | 3509 +++++++++++++++++------------------------------------
 package.json      |    7 +-
 2 files changed, 1123 insertions(+), 2393 deletions(-)

Commit: 71c0810
Date: 2025-09-04
Old message: Integrated low network support
 src/sections/LeaderBoard/LeaderboardsModal.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: b799553
Date: 2025-09-04
Old message: Integrated low network support
 analyze-remaining.sh                               |   82 +
 auto-extract-styles.sh                             |  120 +
 create-component-styles.sh                         |  116 +
 extract-styles-batch.sh                            |  115 +
 fix-imports.sh                                     |  125 +
 package-lock.json                                  | 3767 +++++++++++++-------
 package.json                                       |    7 +-
 src/App.tsx                                        |  205 +-
 src/components/Bonus/Bonus.styles.ts               |   36 +
 src/components/Bonus/BonusModal.tsx                |    6 +
 src/components/Cache/CacheDebugPanel.tsx           |  262 +-
 src/components/Game/GameSplashScreen.tsx           |   33 +-
 src/components/Modal/Modal.tsx                     |   20 +-
 src/components/Platform/PlatformView.tsx           |  154 +-
 src/components/Platform/PlayerView.tsx             |   29 +-
 src/components/Share/ShareModal.tsx                |    3 +-
 src/components/Theme/ThemeSelector.tsx             |   36 +-
 src/components/UI/EnhancedTickerTape.tsx           |   36 +-
 src/components/UI/ResponsiveImage.tsx              |   49 +-
 src/components/UI/Sidebar.tsx                      |    3 +-
 src/constants.ts                                   |   26 +-
 src/games/Flip/index.tsx                           |    5 +-
 src/games/Plinko/game.ts                           |    9 +-
 .../PlinkoRace/components/LobbyBackground.tsx      |   11 +-
 src/games/PlinkoRace/engine/SimulationEngine.ts    |    5 +-
 src/games/Slots/Reel.tsx                           |    7 +-
 src/hooks/useGameplayEffects.ts                    |   16 +-
 src/hooks/useLeaderboardData.ts                    |   46 +-
 src/hooks/useServiceWorker.ts                      |   28 -
 src/hooks/useUserStore.ts                          |   45 -
 src/sections/Dashboard/Dashboard.styles.ts         |    7 +-
 src/sections/Dashboard/Dashboard.tsx               |    4 +-
 src/sections/Dashboard/FairnessAudit.tsx           |   33 +-
 src/sections/Dashboard/GameCard.tsx                |   60 +-
 src/sections/FairnessAudit/FairnessAudit.styles.ts |   16 +-
 src/sections/FairnessAudit/FairnessAudit.tsx       |   33 +-
 src/sections/Footer.tsx                            |  240 +-
 src/sections/Header.tsx                            |  318 +-
 .../LeaderBoard/LeaderboardsModal.styles.ts        |   82 +-
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |   61 +-
 src/sections/RecentPlays/RecentPlays.tsx           |   21 +-
 src/sections/RecentPlays/useRecentPlays.ts         |   65 +-
 src/sections/Toasts.tsx                            |  255 +-
 src/sections/TokenSelect.tsx                       |  124 +-
 src/sections/UserButton.tsx                        |  294 +-
 src/sections/UserProfile/UserProfile.tsx           |   33 +-
 src/styles.css                                     |   24 -
 src/utils/performance.ts                           |   15 +-
 vite.config.ts                                     |   15 +-
 49 files changed, 4767 insertions(+), 2335 deletions(-)

Commit: cd3956a
Date: 2025-09-04
Old message: Integrated low network support
 package-lock.json | 744 ++++++++++++++++++++++++++++++++++--------------------
 1 file changed, 469 insertions(+), 275 deletions(-)

Commit: c5c3361
Date: 2025-09-04
Old message: Integrated low network support
 src/sections/UserProfile/UserProfile.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: 858cb4f
Date: 2025-09-05
Old message: Integrated low network support
 .../PlinkoRace/components/CreateGameModal.tsx      | 207 ++++---
 .../PlinkoRace/components/DebugGameScreen.tsx      | 268 +++++----
 src/games/PlinkoRace/components/GameScreen.tsx     | 126 +++--
 src/games/PlinkoRace/components/Lobby.tsx          | 606 ++++++++++++++-------
 .../PlinkoRace/components/LobbyBackground.tsx      | 208 ++++---
 src/games/rtpConfig.ts                             |  38 +-
 6 files changed, 947 insertions(+), 506 deletions(-)

Commit: 7476676
Date: 2025-09-05
Old message: Integrated low network support
 src/games/rtpConfig.ts | 20 +++++++++++---------
 1 file changed, 11 insertions(+), 9 deletions(-)

Commit: 4b87828
Date: 2025-09-05
Old message: Integrated low network support
 src/games/rtpConfig.ts | 18 +++++++++---------
 1 file changed, 9 insertions(+), 9 deletions(-)

Commit: c685889
Date: 2025-09-05
Old message: Integrated low network support
 src/games/allGames.ts  |  2 +-
 src/games/rtpConfig.ts | 42 +++++++++++++++++++++---------------------
 2 files changed, 22 insertions(+), 22 deletions(-)

Commit: 3f3b189
Date: 2025-09-05
Old message: Integrated low network support
 src/games/allGames.ts  | 2 +-
 src/games/rtpConfig.ts | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)

Commit: da28dd1
Date: 2025-09-05
Old message: Updated Slots UI/UX
 src/games/Slots/Reel.tsx        |  98 +++++++++++++++++----
 src/games/Slots/Slots.styles.ts | 154 +++++++++++++++++++++++++--------
 src/games/Slots/index.tsx       |   3 +
 src/games/Slots/utils.ts        | 184 +++++++++++++++++++++-------------------
 src/games/rtpConfig.ts          |   8 +-
 5 files changed, 307 insertions(+), 140 deletions(-)

Commit: 40338ec
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 package-lock.json                                  | 5789 +++-----------------
 package.json                                       |   10 +-
 public/games/multi-poker.png                       |  Bin 0 -> 1767777 bytes
 public/webp/games/multi-poker.webp                 |  Bin 0 -> 94530 bytes
 src/components/Game/LazyGameLoader.tsx             |    2 +-
 .../MultiPokerBackground.enhanced.styles.ts}       |    0
 .../{ProgressivePoker => MultiPoker}/PokerCard.tsx |    0
 .../{ProgressivePoker => MultiPoker}/betArray.ts   |    0
 .../{ProgressivePoker => MultiPoker}/constants.ts  |    0
 src/games/MultiPoker/index.tsx                     |  952 ++++
 .../sounds/card.mp3                                |  Bin
 .../sounds/lose.mp3                                |  Bin
 .../sounds/play.mp3                                |  Bin
 .../sounds/win.mp3                                 |  Bin
 .../sounds/win2.mp3                                |  Bin
 src/games/ProgressivePoker/index.tsx               |  691 ---
 src/games/allGames.ts                              |   10 +-
 src/games/rtpConfig.ts                             |  117 +-
 src/sections/Dashboard/FairnessAudit.tsx           |    2 +-
 src/sections/FairnessAudit/FairnessAudit.tsx       |    2 +-
 20 files changed, 1955 insertions(+), 5620 deletions(-)

Commit: dbeb4b7
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 EXAMPLES_UUID.ts           | 30 ++++++++++++++++++++++++++++++
 api/utils/uuid.ts          | 30 ++++++++++++++++++++++++++++++
 package-lock.json          | 22 ----------------------
 package.json               |  2 --
 src/games/featuredGames.ts |  2 +-
 src/utils/uuid.ts          | 32 ++++++++++++++++++++++++++++++++
 6 files changed, 93 insertions(+), 25 deletions(-)

Commit: 50180e8
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 EXAMPLES_UUID.ts           |  30 ------------
 analyze-remaining.sh       |  82 -------------------------------
 auto-extract-styles.sh     | 120 ---------------------------------------------
 create-component-styles.sh | 116 -------------------------------------------
 extract-styles-batch.sh    | 115 -------------------------------------------
 package.json               |  12 ++++-
 6 files changed, 11 insertions(+), 464 deletions(-)

Commit: 1569e0b
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 api/utils/uuid.ts | 30 ------------------------------
 package-lock.json | 41 ++++++++++++++++++++++++++++++++++++++++-
 package.json      |  4 ----
 src/utils/uuid.ts | 32 --------------------------------
 vite.config.ts    |  3 ++-
 5 files changed, 42 insertions(+), 68 deletions(-)

Commit: 7b888d0
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 package.json   | 6 +-----
 vite.config.ts | 3 +--
 2 files changed, 2 insertions(+), 7 deletions(-)

Commit: df9dc71
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 api/utils/uuid.ts | 0
 package.json      | 3 ++-
 src/utils/uuid.ts | 0
 3 files changed, 2 insertions(+), 1 deletion(-)

Commit: 579765b
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 api/utils/uuid.ts | 0
 package.json      | 5 +----
 src/utils/uuid.ts | 0
 3 files changed, 1 insertion(+), 4 deletions(-)

Commit: e35c448
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 package.json | 1 -
 1 file changed, 1 deletion(-)

Commit: 576d932
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 package.json | 7 ++-----
 1 file changed, 2 insertions(+), 5 deletions(-)

Commit: f0e2d22
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 package.json | 8 ++++++--
 1 file changed, 6 insertions(+), 2 deletions(-)

Commit: 732d564
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 vite.config.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: a4ff6c8
Date: 2025-09-06
Old message: Updated Poker UI/UX & added new game modes
 src/games/allGames.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: a9196e9
Date: 2025-09-06
Old message: Updated APIs
 api/{ => auth}/auth.ts                         |   0
 api/{ => cache}/cache-admin.ts                 |   0
 api/{ => cache}/cache-warmup.ts                |   0
 api/{ => cache}/xcache-edge.ts                 |   0
 api/{ => cache}/xcacheOnTheFly.ts              |   0
 api/{ => chat}/chat.ts                         |   4 +-
 api/{ => dns}/check-dns.ts                     |   0
 api/{ => services}/coingecko.ts                |   0
 api/{ => services}/helius.ts                   |   0
 fix-imports.sh                                 | 125 -------------------------
 src/components/Connection/ConnectionStatus.tsx |   2 +-
 src/components/UI/TrollBox.tsx                 |   6 +-
 src/constants.ts                               |   8 +-
 src/pages/propagation.tsx                      |   2 +-
 src/utils/cacheMonitor.ts                      |   6 +-
 15 files changed, 14 insertions(+), 139 deletions(-)

Commit: 84d5671
Date: 2025-09-06
Old message: Updated APIs
 index.html                                         |  12 +++---
 public/index.html                                  |  11 +++---
 public/{ => png}/games/blackjack-dual.png          | Bin
 public/{ => png}/games/blackjack.png               | Bin
 public/{ => png}/games/crash.png                   | Bin
 public/{ => png}/games/dice.png                    | Bin
 public/{ => png}/games/flip-dual.png               | Bin
 public/{ => png}/games/flip.png                    | Bin
 public/{ => png}/games/hilo.png                    | Bin
 public/{ => png}/games/lootbox.png                 | Bin
 public/{ => png}/games/mines.png                   | Bin
 public/{ => png}/games/multi-poker.png             | Bin
 public/{ => png}/games/plinko-race.png             | Bin
 public/{ => png}/games/plinko.png                  | Bin
 public/{ => png}/games/poker.png                   | Bin
 public/{ => png}/games/progressive-poker.png       | Bin
 public/{ => png}/games/roulette.png                | Bin
 public/{ => png}/games/slots.png                   | Bin
 public/{ => png/icons}/favicon.ico                 | Bin
 public/{ => png/icons}/favicon.png                 | Bin
 public/{ => png/icons}/icon-192.png                | Bin
 public/{ => png/icons}/icon-512.png                | Bin
 public/{ => png/images}/$DGHRT.png                 | Bin
 public/{ => png/images}/casino.png                 | Bin
 public/{ => png/images}/fakemoney.png              | Bin
 public/{ => png/images}/overlay-glow.png           | Bin
 public/{ => png/images}/pfp.png                    | Bin
 public/{ => png/images}/seo.png                    | Bin
 public/{ => png/images}/stuff.png                  | Bin
 public/{ => png/images}/user.png                   | Bin
 public/sw.js                                       |  12 +++---
 public/webp/{ => icons}/favicon.webp               | Bin
 public/webp/{ => icons}/icon-192.webp              | Bin
 public/webp/{ => icons}/icon-512.webp              | Bin
 public/webp/{ => images}/casino.webp               | Bin
 public/webp/{ => images}/fakemoney.webp            | Bin
 public/webp/{ => images}/overlay-glow.webp         | Bin
 public/webp/{ => images}/pfp.webp                  | Bin
 public/webp/{ => images}/seo.webp                  | Bin
 public/webp/{ => images}/stuff.webp                | Bin
 public/webp/{ => images}/user.webp                 | Bin
 src/App.tsx                                        |  18 ++++-----
 src/components/Cache/CacheDebugPanel.tsx           |   2 +-
 src/components/Debug/CacheDebug.tsx                |   2 +-
 src/components/Dev/AdaptiveFpsOverlay.tsx          |   4 +-
 src/components/Explorer/ExplorerHeader.tsx         |   2 +-
 src/components/Explorer/ExplorerIndex.tsx          |   2 +-
 src/components/Game/GameplayFrame.tsx              |   2 +-
 src/components/Platform/PlatformView.tsx           |   2 +-
 .../Referral/CompactReferralLeaderboard.tsx        |   6 +--
 .../Referral/FullReferralLeaderboard.tsx           |   8 ++--
 src/components/Referral/ReferralDashboard.tsx      |   8 ++--
 .../Referral/ReferralLeaderboardModal.tsx          |   6 +--
 src/components/Settings/SettingsModal.tsx          |   4 +-
 src/components/Transaction/Transaction.tsx         |  12 +++---
 src/components/UI/EnhancedTickerTape.tsx           |   4 +-
 src/components/UI/SmartImage.tsx                   |   2 +-
 src/components/UI/TrollBox.tsx                     |   2 +-
 src/components/index.tsx                           |   2 +-
 src/constants.ts                                   |   2 +-
 src/contexts/RefreshContext.tsx                    |   2 +-
 src/hooks/{ => analytics}/useReferralAnalytics.ts  |   2 +-
 src/hooks/{ => data}/useLeaderboardData.ts         |   0
 src/hooks/{ => data}/useTokenPriceChanges.ts       |   4 +-
 src/hooks/{ => data}/useTokenPriceService.ts       |   2 +-
 src/hooks/{ => data}/useTokenPrices.ts             |   2 +-
 src/hooks/{ => data}/useUserStore.ts               |  42 +++++++++++++++++++++
 src/hooks/{ => game}/useGameOutcome.ts             |   0
 src/hooks/{ => game}/useGameplayEffects.ts         |   2 +-
 src/hooks/{ => system}/usePrefetch.ts              |   0
 src/hooks/{ => system}/useServiceWorker.ts         |   2 +-
 src/hooks/{ => ui}/useIsCompact.ts                 |   0
 src/hooks/{ => ui}/useMediaQuery.ts                |   0
 src/hooks/{ => ui}/useOnClickOutside.ts            |   0
 src/hooks/{ => ui}/useOutsideClick.ts              |   0
 src/hooks/{ => ui}/useToast.ts                     |   0
 src/pages/{ => features}/BonusPage.tsx             |   6 +--
 src/pages/{ => features}/JackpotPage.tsx           |   6 +--
 src/pages/{ => features}/LeaderboardPage.tsx       |   6 +--
 src/pages/{ => features}/SelectTokenPage.tsx       |   0
 src/pages/{ => system}/propagation.tsx             |   0
 src/sections/Dashboard/Dashboard.tsx               |   2 +-
 src/sections/Game/Game.tsx                         |   2 +-
 src/sections/Header.tsx                            |   4 +-
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |   2 +-
 src/sections/LeaderBoard/Modal.tsx                 |   2 +-
 src/sections/RecentPlays/RecentPlays.tsx           |   2 +-
 src/sections/Toasts.tsx                            |   4 +-
 src/sections/TokenSelect.tsx                       |  10 ++---
 src/sections/UserButton.tsx                        |   6 +--
 src/sections/UserProfile/UserProfile.tsx           |   2 +-
 src/utils/{ => cache}/cache.ts                     |   0
 src/utils/{ => cache}/cacheMonitor.ts              |   0
 src/utils/{ => general}/emitChips.ts               |   0
 src/utils/{ => general}/polyfills.ts               |   0
 src/utils/{ => general}/prefetch.ts                |   0
 src/utils/{ => general}/preloading.ts              |  16 ++++----
 src/utils/{ => general}/timeAccess.ts              |   0
 src/utils/{ => performance}/imageOptimization.ts   |  16 ++++----
 src/utils/{ => performance}/performance.ts         |   0
 src/utils/{ => performance}/rafScheduler.ts        |   0
 src/utils/{ => user}/referralTier.ts               |   2 +-
 src/utils/{ => user}/userProfileUtils.ts           |   0
 src/utils/{ => wallet}/solanaWalletToast.ts        |   2 +-
 104 files changed, 157 insertions(+), 116 deletions(-)

Commit: bcbe5bc
Date: 2025-09-06
Old message: Updated APIs
 src/pages/features/SelectTokenPage.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: 18f4d9d
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/propagation.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 0db8c04
Date: 2025-09-06
Old message: Updated APIs
 api/dns/check-dns.ts      | 2 +-
 api/services/coingecko.ts | 2 +-
 api/services/helius.ts    | 2 +-
 3 files changed, 3 insertions(+), 3 deletions(-)

Commit: e5395fe
Date: 2025-09-06
Old message: Updated APIs
 scripts/check-compression.sh   |  33 ----------
 scripts/compress-build.mjs     | 136 -----------------------------------------
 scripts/convert-game-images.js |  41 -------------
 scripts/optimize-images.mjs    |  95 ----------------------------
 4 files changed, 305 deletions(-)

Commit: 361a207
Date: 2025-09-06
Old message: Updated APIs
 LICENCE   |  21 ++++++
 readme.md | 255 ++++++++++++++++++++++++++++++++++----------------------------
 2 files changed, 161 insertions(+), 115 deletions(-)

Commit: 233208b
Date: 2025-09-06
Old message: Updated APIs
 .gitignore                 |   1 -
 scripts/compress-build.mjs | 136 +++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 136 insertions(+), 1 deletion(-)

Commit: 91384f5
Date: 2025-09-06
Old message: Updated APIs
 readme.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 442eed0
Date: 2025-09-06
Old message: Updated APIs
 LICENCE => LICENSE | 0
 1 file changed, 0 insertions(+), 0 deletions(-)

Commit: 811d9f2
Date: 2025-09-06
Old message: Updated APIs
 readme.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 9d0a99c
Date: 2025-09-06
Old message: Updated APIs
 readme.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: b5f856f
Date: 2025-09-06
Old message: Updated APIs
 .gitignore                                     |  1 +
 api/audit/edgeCases.ts                         | 17 +++++--
 api/auth/auth.ts                               | 68 +++++++++++++++++++++++++-
 api/cache/cache-admin.ts                       | 29 ++++++++---
 api/cache/cache-warmup.ts                      |  7 ++-
 api/chat/chat.ts                               | 44 ++++++++++++++---
 api/dns/check-dns.ts                           | 14 +++++-
 api/services/coingecko.ts                      | 10 +++-
 api/services/helius.ts                         | 18 ++++++-
 package-lock.json                              | 17 ++-----
 package.json                                   |  4 ++
 public/sw.js                                   |  6 +++
 src/App.tsx                                    |  2 +-
 src/components/Cache/CacheDebugPanel.tsx       | 11 ++---
 src/components/Connection/ConnectionStatus.tsx |  3 +-
 src/components/Debug/CacheDebug.tsx            |  2 +-
 src/components/Modal/ErrorModal.tsx            |  2 +-
 src/constants.ts                               |  2 +-
 src/index.tsx                                  | 10 ++--
 vercel.json                                    | 37 ++++++++++++++
 20 files changed, 249 insertions(+), 55 deletions(-)

Commit: 6c98212
Date: 2025-09-06
Old message: Updated APIs
 api/chat/chat.ts | 53 +++++++++++++++++++++++++++++++++++++++++++++--------
 1 file changed, 45 insertions(+), 8 deletions(-)

Commit: 15115f8
Date: 2025-09-06
Old message: Updated APIs
 api/chat/chat.ts                         | 23 +++++++++++++--
 index.html                               | 50 --------------------------------
 package.json                             |  6 ++--
 public/index.html                        |  7 +++++
 public/sw.js                             | 17 +++++++----
 src/sections/UserProfile/UserProfile.tsx |  2 +-
 6 files changed, 44 insertions(+), 61 deletions(-)

Commit: 6d1d48b
Date: 2025-09-06
Old message: Updated APIs
 vite.config.ts | 1 +
 1 file changed, 1 insertion(+)

Commit: 6493c4c
Date: 2025-09-06
Old message: Updated APIs
 public/index.html | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: bd2c18b
Date: 2025-09-06
Old message: Updated APIs
 vercel.json | 6 ++++++
 1 file changed, 6 insertions(+)

Commit: 7be8b4f
Date: 2025-09-06
Old message: Updated APIs
 vercel.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: d935254
Date: 2025-09-06
Old message: Updated APIs
 vercel.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: 1163c91
Date: 2025-09-06
Old message: Updated APIs
 vercel.json | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)

Commit: 61d727c
Date: 2025-09-06
Old message: Updated APIs
 package.json | 2 +-
 vercel.json  | 5 -----
 2 files changed, 1 insertion(+), 6 deletions(-)

Commit: 2582b7b
Date: 2025-09-06
Old message: Updated APIs
 api/audit/edgeCases.ts      | 30 ++++++--------
 api/audit/rtpConfigTypes.ts | 95 +++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 106 insertions(+), 19 deletions(-)

Commit: f69d40b
Date: 2025-09-06
Old message: Inline Edge Function dependencies to eliminate tweetnacl import issues
 api/audit/edgeCases.ts      | 92 ++++++++++++++++++++++++++++++++++++++++++-
 api/audit/rtpConfigTypes.ts | 95 ---------------------------------------------
 2 files changed, 90 insertions(+), 97 deletions(-)

Commit: 0d3d805
Date: 2025-09-06
Old message: Updated APIs
 api/chat/chat.ts  | 22 ++++++----------------
 package-lock.json | 25 +++++++------------------
 package.json      |  1 -
 3 files changed, 13 insertions(+), 35 deletions(-)

Commit: 590df42
Date: 2025-09-06
Old message: Revert tweetnacl changes and keep audit function as Node.js runtime
 api/audit/edgeCases.ts | 2 +-
 api/chat/chat.ts       | 3 +--
 2 files changed, 2 insertions(+), 3 deletions(-)

Commit: 5da877a
Date: 2025-09-06
Old message: Updated APIs
 api/audit/edgeCases.ts                         | 139 +++++--------------------
 api/auth/auth.ts                               |  68 +-----------
 api/cache/cache-admin.ts                       |  29 ++----
 api/cache/cache-warmup.ts                      |   7 +-
 api/chat/chat.ts                               |  89 ++--------------
 api/dns/check-dns.ts                           |  14 +--
 api/services/coingecko.ts                      |  10 +-
 api/services/helius.ts                         |  18 +---
 package.json                                   |  10 +-
 public/index.html                              |   9 +-
 public/sw.js                                   |  23 +---
 src/App.tsx                                    |   2 +-
 src/components/Cache/CacheDebugPanel.tsx       |  11 +-
 src/components/Connection/ConnectionStatus.tsx |   3 +-
 src/components/Debug/CacheDebug.tsx            |   2 +-
 src/components/Modal/ErrorModal.tsx            |   2 +-
 src/constants.ts                               |   2 +-
 src/index.tsx                                  |  10 +-
 src/sections/UserProfile/UserProfile.tsx       |   2 +-
 vercel.json                                    |  37 -------
 vite.config.ts                                 |   1 -
 21 files changed, 74 insertions(+), 414 deletions(-)

Commit: daae459
Date: 2025-09-06
Old message: Updated APIs
 src/games/PlinkoRace/constants.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

Commit: a1db712
Date: 2025-09-06
Old message: Updated APIs
 package.json | 7 +++----
 1 file changed, 3 insertions(+), 4 deletions(-)

Commit: 42b8365
Date: 2025-09-06
Old message: Updated APIs
 api/audit/edgeCases.ts                             |  297 -----
 api/auth/auth.ts                                   |   10 -
 api/cache/cache-admin.ts                           |   85 --
 api/cache/cache-warmup.ts                          |   78 --
 api/cache/xcache-edge.ts                           |  138 ---
 api/cache/xcacheOnTheFly.ts                        |  132 --
 api/chat/chat.ts                                   |  123 --
 api/dns/check-dns.ts                               |  141 ---
 api/services/coingecko.ts                          |   63 -
 api/services/helius.ts                             |   30 -
 public/index.html => index.html                    |    8 +-
 package-lock.json                                  |   25 +-
 package.json                                       |    6 +-
 public/manifest.webmanifest                        |   23 -
 public/png/games/blackjack-dual.png                |  Bin 1361250 -> 0 bytes
 public/png/games/blackjack.png                     |  Bin 1739398 -> 0 bytes
 public/png/games/crash.png                         |  Bin 1908089 -> 0 bytes
 public/png/games/dice.png                          |  Bin 1493263 -> 0 bytes
 public/png/games/flip-dual.png                     |  Bin 1367197 -> 0 bytes
 public/png/games/flip.png                          |  Bin 1747803 -> 0 bytes
 public/png/games/hilo.png                          |  Bin 1587854 -> 0 bytes
 public/png/games/lootbox.png                       |  Bin 1690629 -> 0 bytes
 public/png/games/mines.png                         |  Bin 1320519 -> 0 bytes
 public/png/games/multi-poker.png                   |  Bin 1767777 -> 0 bytes
 public/png/games/plinko-race.png                   |  Bin 1249121 -> 0 bytes
 public/png/games/plinko.png                        |  Bin 1669948 -> 0 bytes
 public/png/games/poker.png                         |  Bin 1739398 -> 0 bytes
 public/png/games/progressive-poker.png             |  Bin 1383658 -> 0 bytes
 public/png/games/roulette.png                      |  Bin 1748292 -> 0 bytes
 public/png/games/slots.png                         |  Bin 1690629 -> 0 bytes
 public/png/icons/favicon.ico                       |  Bin 15406 -> 0 bytes
 public/png/icons/favicon.png                       |  Bin 23999 -> 0 bytes
 public/png/icons/icon-192.png                      |  Bin 26617 -> 0 bytes
 public/png/icons/icon-512.png                      |  Bin 128958 -> 0 bytes
 public/png/images/$DGHRT.png                       |  Bin 1597081 -> 0 bytes
 public/png/images/casino.png                       |  Bin 705686 -> 0 bytes
 public/png/images/fakemoney.png                    |  Bin 1744 -> 0 bytes
 public/png/images/overlay-glow.png                 |  Bin 1468219 -> 0 bytes
 public/png/images/pfp.png                          |  Bin 1778881 -> 0 bytes
 public/png/images/seo.png                          |  Bin 458602 -> 0 bytes
 public/png/images/stuff.png                        |  Bin 3264 -> 0 bytes
 public/png/images/user.png                         |  Bin 1597081 -> 0 bytes
 public/sw.js                                       |  210 ----
 public/webp/games/blackjack-dual.webp              |  Bin 53132 -> 0 bytes
 public/webp/games/blackjack.webp                   |  Bin 88344 -> 0 bytes
 public/webp/games/crash.webp                       |  Bin 120508 -> 0 bytes
 public/webp/games/dice.webp                        |  Bin 62484 -> 0 bytes
 public/webp/games/flip-dual.webp                   |  Bin 46154 -> 0 bytes
 public/webp/games/flip.webp                        |  Bin 95248 -> 0 bytes
 public/webp/games/hilo.webp                        |  Bin 47422 -> 0 bytes
 public/webp/games/lootbox.webp                     |  Bin 68796 -> 0 bytes
 public/webp/games/mines.webp                       |  Bin 44152 -> 0 bytes
 public/webp/games/multi-poker.webp                 |  Bin 94530 -> 0 bytes
 public/webp/games/plinko-race.webp                 |  Bin 30272 -> 0 bytes
 public/webp/games/plinko.webp                      |  Bin 63658 -> 0 bytes
 public/webp/games/poker.webp                       |  Bin 88344 -> 0 bytes
 public/webp/games/progressive-poker.webp           |  Bin 59660 -> 0 bytes
 public/webp/games/roulette.webp                    |  Bin 93602 -> 0 bytes
 public/webp/games/slots.webp                       |  Bin 68796 -> 0 bytes
 public/webp/icons/favicon.webp                     |  Bin 9418 -> 0 bytes
 public/webp/icons/icon-192.webp                    |  Bin 10258 -> 0 bytes
 public/webp/icons/icon-512.webp                    |  Bin 37818 -> 0 bytes
 public/webp/images/casino.webp                     |  Bin 36894 -> 0 bytes
 public/webp/images/fakemoney.webp                  |  Bin 1176 -> 0 bytes
 public/webp/images/overlay-glow.webp               |  Bin 66868 -> 0 bytes
 public/webp/images/pfp.webp                        |  Bin 49382 -> 0 bytes
 public/webp/images/seo.webp                        |  Bin 18674 -> 0 bytes
 public/webp/images/stuff.webp                      |  Bin 1504 -> 0 bytes
 public/webp/images/user.webp                       |  Bin 114552 -> 0 bytes
 screenshots/1.jpg                                  |  Bin 211802 -> 0 bytes
 screenshots/2.jpg                                  |  Bin 284904 -> 0 bytes
 screenshots/3.jpg                                  |  Bin 322239 -> 0 bytes
 scripts/compress-build.mjs                         |  136 ---
 src/App.tsx                                        |  278 -----
 src/GlobalErrorBoundary.tsx                        |   34 -
 .../AllGamesModal/AllGamesModal.styles.ts          |  138 ---
 src/components/AllGamesModal/AllGamesModal.tsx     |   67 --
 src/components/Bonus/Bonus.styles.ts               |  133 ---
 src/components/Bonus/BonusModal.tsx                |   67 --
 src/components/Cache/Cache.styles.ts               |  109 --
 src/components/Cache/CacheDebugPanel.tsx           |  177 ---
 src/components/Connection/Connection.styles.ts     |  244 ----
 src/components/Connection/ConnectionStatus.tsx     |  317 -----
 src/components/Connection/PropagationStatus.tsx    |   32 -
 src/components/Debug/CacheDebug.tsx                |  151 ---
 src/components/Dev/AdaptiveFpsOverlay.tsx          |   68 --
 src/components/Dropdown/Dropdown.styles.ts         |   13 -
 src/components/Dropdown/Dropdown.tsx               |   66 -
 src/components/Explorer/Explorer.styles.ts         |   13 -
 src/components/Explorer/ExplorerHeader.tsx         |   94 --
 src/components/Explorer/ExplorerIndex.tsx          |  190 ---
 src/components/Game/EnhancedGameControls.tsx       |  447 -------
 src/components/Game/Game.styles.ts                 |   13 -
 src/components/Game/GameScreenFrame.tsx            |  943 ---------------
 src/components/Game/GameSplashScreen.tsx           |  335 ------
 src/components/Game/GameplayFrame.tsx              |  195 ---
 src/components/Game/LazyGameLoader.tsx             |   60 -
 src/components/Graphics/Graphics.styles.ts         |   13 -
 src/components/Graphics/GraphicsSettings.tsx       |  398 ------
 src/components/Jackpot/Jackpot.styles.ts           |   13 -
 src/components/Jackpot/JackpotModal.tsx            |  371 ------
 src/components/Mobile/Mobile.styles.ts             |   13 -
 src/components/Mobile/MobileControls.tsx           | 1062 ----------------
 src/components/Mobile/MobileGameControls.tsx       |  266 -----
 src/components/Modal/ErrorModal.tsx                |  126 --
 src/components/Modal/Modal.styles.ts               |  127 --
 src/components/Modal/Modal.tsx                     |   94 --
 src/components/Platform/Platform.styles.ts         |   13 -
 src/components/Platform/PlatformView.tsx           |  741 ------------
 src/components/Platform/PlayerView.tsx             |  456 -------
 .../Referral/CompactReferralLeaderboard.tsx        |  271 -----
 .../Referral/FullReferralLeaderboard.tsx           |  314 -----
 src/components/Referral/Referral.styles.ts         |   13 -
 src/components/Referral/ReferralDashboard.tsx      |  334 ------
 .../Referral/ReferralLeaderboardModal.tsx          |  478 --------
 src/components/Settings/Settings.styles.ts         |  228 ----
 src/components/Settings/SettingsModal.tsx          |  254 ----
 src/components/Share/Share.styles.ts               |   13 -
 src/components/Share/ShareModal.tsx                |  378 ------
 src/components/Theme/Theme.styles.ts               |   13 -
 src/components/Theme/ThemeSelector.tsx             |  124 --
 src/components/Transaction/EmbeddedTransaction.tsx |  153 ---
 src/components/Transaction/FeesTab.tsx             |  158 ---
 src/components/Transaction/Transaction.styles.ts   |   13 -
 src/components/Transaction/Transaction.tsx         | 1263 --------------------
 src/components/UI/EnhancedTickerTape.tsx           |  357 ------
 src/components/UI/Icon.tsx                         |  183 ---
 src/components/UI/PriceIndicator.tsx               |  153 ---
 src/components/UI/ResponsiveImage.tsx              |   83 --
 src/components/UI/Sidebar.tsx                      |  144 ---
 src/components/UI/Slider.tsx                       |   94 --
 src/components/UI/SmartImage.tsx                   |   71 --
 src/components/UI/TrollBox.tsx                     |  625 ----------
 src/components/UI/UI.styles.ts                     |   13 -
 src/components/index.tsx                           |  114 --
 src/constants.ts                                   |  366 ------
 src/constants/QuotesVault.ts                       |  185 ---
 src/constants/errorCodes.ts                        |   82 --
 src/contexts/RefreshContext.tsx                    |   45 -
 src/fairness/deterministicRng.ts                   |   22 -
 .../BlackjackBackground.enhanced.styles.ts         | 1152 ------------------
 src/games/BlackJack/CardComponents.tsx             |  144 ---
 src/games/BlackJack/betArray.ts                    |    5 -
 src/games/BlackJack/card.mp3                       |  Bin 4248 -> 0 bytes
 src/games/BlackJack/constants.ts                   |   55 -
 src/games/BlackJack/index.tsx                      |  420 -------
 src/games/BlackJack/lose.mp3                       |  Bin 21192 -> 0 bytes
 src/games/BlackJack/play.mp3                       |  Bin 17266 -> 0 bytes
 src/games/BlackJack/styles.ts                      |   79 --
 src/games/BlackJack/win.mp3                        |  Bin 9452 -> 0 bytes
 src/games/BlackJack/win2.mp3                       |  Bin 24359 -> 0 bytes
 .../CrashGame/CrashBackground.enhanced.styles.ts   |  267 -----
 src/games/CrashGame/Slider.tsx                     |   99 --
 src/games/CrashGame/constants.ts                   |    3 -
 src/games/CrashGame/crash.mp3                      |  Bin 53637 -> 0 bytes
 src/games/CrashGame/index.tsx                      |  201 ----
 src/games/CrashGame/music.mp3                      |  Bin 1394431 -> 0 bytes
 src/games/CrashGame/rocket.gif                     |  Bin 1853209 -> 0 bytes
 src/games/CrashGame/rocket.webp                    |  Bin 904948 -> 0 bytes
 src/games/CrashGame/styles.ts                      |  135 ---
 src/games/CrashGame/utils.ts                       |    8 -
 src/games/CrashGame/win.mp3                        |  Bin 86526 -> 0 bytes
 src/games/Dice/DiceBackground.enhanced.styles.ts   |  486 --------
 src/games/Dice/DiceBackground.styles.ts            |    0
 src/games/Dice/DicePhysics.tsx                     |  110 --
 src/games/Dice/Slider.tsx                          |  128 --
 src/games/Dice/constants.ts                        |    7 -
 src/games/Dice/index.tsx                           |  225 ----
 src/games/Dice/lose.mp3                            |  Bin 21192 -> 0 bytes
 src/games/Dice/play.mp3                            |  Bin 17266 -> 0 bytes
 src/games/Dice/styles-new.ts                       |  291 -----
 src/games/Dice/styles.ts                           |   93 --
 src/games/Dice/tick.mp3                            |  Bin 1440 -> 0 bytes
 src/games/Dice/win.mp3                             |  Bin 73992 -> 0 bytes
 src/games/Flip/Coin.tsx                            |  150 ---
 src/games/Flip/Effect.tsx                          |   46 -
 src/games/Flip/FlipBackground.enhanced.styles.ts   |  685 -----------
 src/games/Flip/betArrays.ts                        |    5 -
 src/games/Flip/coin.mp3                            |  Bin 4652 -> 0 bytes
 src/games/Flip/constants.ts                        |    5 -
 src/games/Flip/heads.png                           |  Bin 310164 -> 0 bytes
 src/games/Flip/heads.webp                          |  Bin 42808 -> 0 bytes
 src/games/Flip/index.tsx                           |  382 ------
 src/games/Flip/lose.mp3                            |  Bin 10988 -> 0 bytes
 src/games/Flip/star.png                            |  Bin 2056 -> 0 bytes
 src/games/Flip/star.webp                           |  Bin 1098 -> 0 bytes
 src/games/Flip/tails.png                           |  Bin 310248 -> 0 bytes
 src/games/Flip/tails.webp                          |  Bin 42818 -> 0 bytes
 src/games/Flip/win.mp3                             |  Bin 9452 -> 0 bytes
 src/games/HiLo/HiLoBackground.enhanced.styles.ts   |  253 ----
 src/games/HiLo/betArray.ts                         |    5 -
 src/games/HiLo/card.mp3                            |  Bin 4248 -> 0 bytes
 src/games/HiLo/constants.ts                        |   27 -
 src/games/HiLo/finish.mp3                          |  Bin 26952 -> 0 bytes
 src/games/HiLo/index.tsx                           |  521 --------
 src/games/HiLo/lose.mp3                            |  Bin 21192 -> 0 bytes
 src/games/HiLo/play.mp3                            |  Bin 17266 -> 0 bytes
 src/games/HiLo/styles.ts                           |  307 -----
 src/games/HiLo/win.mp3                             |  Bin 9452 -> 0 bytes
 src/games/Mines/MinesBackground.enhanced.styles.ts |  267 -----
 src/games/Mines/axe.mp3                            |  Bin 15212 -> 0 bytes
 src/games/Mines/betArray.ts                        |    5 -
 src/games/Mines/constants.ts                       |   10 -
 src/games/Mines/explode.mp3                        |  Bin 32876 -> 0 bytes
 src/games/Mines/finish.mp3                         |  Bin 26952 -> 0 bytes
 src/games/Mines/index.tsx                          |  505 --------
 src/games/Mines/step.mp3                           |  Bin 8684 -> 0 bytes
 src/games/Mines/styles.ts                          |  297 -----
 src/games/Mines/tick.mp3                           |  Bin 64748 -> 0 bytes
 src/games/Mines/types.ts                           |   11 -
 src/games/Mines/utils.ts                           |   42 -
 src/games/Mines/win.mp3                            |  Bin 42476 -> 0 bytes
 .../MultiPokerBackground.enhanced.styles.ts        |  391 ------
 src/games/MultiPoker/PokerCard.tsx                 |  135 ---
 src/games/MultiPoker/betArray.ts                   |   11 -
 src/games/MultiPoker/constants.ts                  |   21 -
 src/games/MultiPoker/index.tsx                     |  952 ---------------
 src/games/MultiPoker/sounds/card.mp3               |  Bin 4248 -> 0 bytes
 src/games/MultiPoker/sounds/lose.mp3               |  Bin 21192 -> 0 bytes
 src/games/MultiPoker/sounds/play.mp3               |  Bin 17266 -> 0 bytes
 src/games/MultiPoker/sounds/win.mp3                |  Bin 9452 -> 0 bytes
 src/games/MultiPoker/sounds/win2.mp3               |  Bin 24359 -> 0 bytes
 src/games/Plinko/BucketScoreboard.tsx              |  315 -----
 .../Plinko/PlinkoBackground.enhanced.styles.ts     |  490 --------
 src/games/Plinko/betArrays.ts                      |    6 -
 src/games/Plinko/binomialEngine.ts                 |  176 ---
 src/games/Plinko/bump.mp3                          |  Bin 1440 -> 0 bytes
 src/games/Plinko/constants.ts                      |    6 -
 src/games/Plinko/fall.mp3                          |  Bin 10604 -> 0 bytes
 src/games/Plinko/game.ts                           |  462 -------
 src/games/Plinko/index.tsx                         |  630 ----------
 src/games/Plinko/styles.ts                         |    0
 src/games/Plinko/win.mp3                           |  Bin 42476 -> 0 bytes
 .../PlinkoRaceBackground.enhanced.styles.ts        |  397 ------
 src/games/PlinkoRace/board/Board.tsx               |  294 -----
 src/games/PlinkoRace/board/BoardHUD.tsx            |   46 -
 src/games/PlinkoRace/board/BoardRenderer.tsx       |  424 -------
 src/games/PlinkoRace/board/Scoreboard.tsx          |  465 -------
 .../PlinkoRace/components/CreateGameModal.tsx      |  444 -------
 .../PlinkoRace/components/DebugGameScreen.tsx      |  350 ------
 src/games/PlinkoRace/components/GameScreen.tsx     |  284 -----
 src/games/PlinkoRace/components/Lobby.tsx          |  515 --------
 .../PlinkoRace/components/LobbyBackground.tsx      |  197 ---
 src/games/PlinkoRace/constants.ts                  |    5 -
 src/games/PlinkoRace/engine/PhysicsWorld.ts        |   84 --
 src/games/PlinkoRace/engine/SimulationEngine.ts    |  392 ------
 src/games/PlinkoRace/engine/constants.ts           |   59 -
 src/games/PlinkoRace/engine/deterministic.ts       |   21 -
 src/games/PlinkoRace/engine/index.ts               |    5 -
 src/games/PlinkoRace/engine/types.ts               |   21 -
 src/games/PlinkoRace/hooks/useMultiPlinko.ts       |   35 -
 src/games/PlinkoRace/index.tsx                     |  261 ----
 src/games/PlinkoRace/musicManager.ts               |   50 -
 src/games/PlinkoRace/sounds/action.mp3             |  Bin 802733 -> 0 bytes
 src/games/PlinkoRace/sounds/bigcombo.mp3           |  Bin 7958 -> 0 bytes
 src/games/PlinkoRace/sounds/bump.mp3               |  Bin 1440 -> 0 bytes
 src/games/PlinkoRace/sounds/extraball.mp3          |  Bin 14266 -> 0 bytes
 src/games/PlinkoRace/sounds/fall.mp3               |  Bin 10604 -> 0 bytes
 src/games/PlinkoRace/sounds/finsh.mp3              |  Bin 6286 -> 0 bytes
 src/games/PlinkoRace/sounds/lobby.mp3              |  Bin 907244 -> 0 bytes
 src/games/PlinkoRace/sounds/lobbymusic.mp3         |  Bin 1200109 -> 0 bytes
 src/games/PlinkoRace/sounds/ouch.mp3               |  Bin 5696 -> 0 bytes
 src/games/PlinkoRace/sounds/readygo.mp3            |  Bin 18413 -> 0 bytes
 src/games/PlinkoRace/sounds/win.mp3                |  Bin 42476 -> 0 bytes
 src/games/Roulette/Chip.tsx                        |   56 -
 src/games/Roulette/Roulette.styles.ts              |  212 ----
 src/games/Roulette/Table.tsx                       |   62 -
 src/games/Roulette/chip.mp3                        |  Bin 1831 -> 0 bytes
 src/games/Roulette/constants.ts                    |   95 --
 src/games/Roulette/index.tsx                       |  328 -----
 src/games/Roulette/lose.mp3                        |  Bin 21192 -> 0 bytes
 src/games/Roulette/play.mp3                        |  Bin 17266 -> 0 bytes
 src/games/Roulette/signals.ts                      |   78 --
 src/games/Roulette/win.mp3                         |  Bin 9452 -> 0 bytes
 src/games/Slots/ItemPreview.styles.ts              |  151 ---
 src/games/Slots/ItemPreview.tsx                    |   53 -
 src/games/Slots/Reel.tsx                           |  364 ------
 src/games/Slots/Slot.styles.ts                     |   66 -
 src/games/Slots/Slot.tsx                           |  119 --
 src/games/Slots/SlotComponents.tsx                 |  275 -----
 src/games/Slots/Slots.styles.ts                    |  615 ----------
 src/games/Slots/SlotsBackground.enhanced.styles.ts |   62 -
 src/games/Slots/assets/coin.mp3                    |  Bin 44012 -> 0 bytes
 src/games/Slots/assets/insert.mp3                  |  Bin 44012 -> 0 bytes
 src/games/Slots/assets/lose.mp3                    |  Bin 25032 -> 0 bytes
 src/games/Slots/assets/money.mp3                   |  Bin 119660 -> 0 bytes
 src/games/Slots/assets/play.mp3                    |  Bin 17266 -> 0 bytes
 src/games/Slots/assets/reveal-legendary.mp3        |  Bin 53996 -> 0 bytes
 src/games/Slots/assets/reveal.mp3                  |  Bin 42476 -> 0 bytes
 src/games/Slots/assets/slot-bonk.png               |  Bin 134126 -> 0 bytes
 src/games/Slots/assets/slot-bonk.webp              |  Bin 14868 -> 0 bytes
 src/games/Slots/assets/slot-dghrt.png              |  Bin 310164 -> 0 bytes
 src/games/Slots/assets/slot-dghrt.webp             |  Bin 42808 -> 0 bytes
 src/games/Slots/assets/slot-jup.png                |  Bin 28312 -> 0 bytes
 src/games/Slots/assets/slot-jup.webp               |  Bin 7522 -> 0 bytes
 src/games/Slots/assets/slot-legendary.png          |  Bin 1013150 -> 0 bytes
 src/games/Slots/assets/slot-legendary.webp         |  Bin 123642 -> 0 bytes
 src/games/Slots/assets/slot-mythical.png           |  Bin 953452 -> 0 bytes
 src/games/Slots/assets/slot-mythical.webp          |  Bin 130430 -> 0 bytes
 src/games/Slots/assets/slot-sol.png                |  Bin 111290 -> 0 bytes
 src/games/Slots/assets/slot-sol.webp               |  Bin 9058 -> 0 bytes
 src/games/Slots/assets/slot-unicorn.png            |  Bin 106788 -> 0 bytes
 src/games/Slots/assets/slot-unicorn.webp           |  Bin 27296 -> 0 bytes
 src/games/Slots/assets/slot-usdc.png               |  Bin 9276 -> 0 bytes
 src/games/Slots/assets/slot-usdc.webp              |  Bin 5534 -> 0 bytes
 src/games/Slots/assets/slot-wojak.png              |  Bin 185454 -> 0 bytes
 src/games/Slots/assets/slot-wojak.webp             |  Bin 22748 -> 0 bytes
 src/games/Slots/assets/spin.mp3                    |  Bin 108140 -> 0 bytes
 src/games/Slots/assets/win.mp3                     |  Bin 69864 -> 0 bytes
 src/games/Slots/constants.ts                       |   54 -
 src/games/Slots/index.tsx                          |  314 -----
 src/games/Slots/utils.ts                           |  253 ----
 src/games/allGames.ts                              |  146 ---
 src/games/featuredGames.ts                         |    7 -
 src/games/getVisibleGames.ts                       |   20 -
 src/games/index.tsx                                |    1 -
 src/games/rtpConfig.ts                             |  822 -------------
 src/games/types.ts                                 |   18 -
 src/games/useGameMeta.ts                           |    6 -
 src/hooks/analytics/useReferralAnalytics.ts        |   65 -
 src/hooks/data/useLeaderboardData.ts               |   80 --
 src/hooks/data/useTokenPriceChanges.ts             |  144 ---
 src/hooks/data/useTokenPriceService.ts             |   50 -
 src/hooks/data/useTokenPrices.ts                   |   40 -
 src/hooks/data/useUserStore.ts                     |   90 --
 src/hooks/game/useGameOutcome.ts                   |   76 --
 src/hooks/game/useGameplayEffects.ts               |  196 ---
 src/hooks/system/usePrefetch.ts                    |  217 ----
 src/hooks/system/useServiceWorker.ts               |   93 --
 src/hooks/ui/useIsCompact.ts                       |   27 -
 src/hooks/ui/useMediaQuery.ts                      |   30 -
 src/hooks/ui/useOnClickOutside.ts                  |   21 -
 src/hooks/ui/useOutsideClick.ts                    |   17 -
 src/hooks/ui/useToast.ts                           |   37 -
 src/index.tsx                                      |  117 --
 src/pages/features/BonusPage.tsx                   |  128 --
 src/pages/features/JackpotPage.tsx                 |  128 --
 src/pages/features/LeaderboardPage.tsx             |  161 ---
 src/pages/features/SelectTokenPage.tsx             |  165 ---
 src/pages/system/propagation.tsx                   |  696 -----------
 src/sections/Dashboard/AboutMe/AboutMe.styles.ts   |  256 ----
 src/sections/Dashboard/AboutMe/AboutMe.tsx         |   71 --
 src/sections/Dashboard/Dashboard.styles.ts         |  374 ------
 src/sections/Dashboard/Dashboard.tsx               |  168 ---
 src/sections/Dashboard/FairnessAudit.tsx           |  849 -------------
 .../FeaturedGameCard/FeaturedGameCard.styles.ts    |   85 --
 .../FeaturedGameCard/FeaturedGameCard.tsx          |   25 -
 .../FeaturedInlineGame.styles.ts                   |   29 -
 .../FeaturedInlineGame/FeaturedInlineGame.tsx      |   49 -
 src/sections/Dashboard/GameCard.styles.ts          |  152 ---
 src/sections/Dashboard/GameCard.tsx                |  124 --
 src/sections/Dashboard/Terms/Terms.styles.ts       |  224 ----
 src/sections/Dashboard/Terms/Terms.tsx             |  177 ---
 .../WelcomeBanner/WelcomeBanner.styles.ts          |  429 -------
 .../Dashboard/WelcomeBanner/WelcomeBanner.tsx      |  103 --
 .../Dashboard/Whitepaper/Whitepaper.styles.ts      |  162 ---
 src/sections/Dashboard/Whitepaper/Whitepaper.tsx   |  121 --
 src/sections/FairnessAudit/FairnessAudit.styles.ts | 1050 ----------------
 src/sections/FairnessAudit/FairnessAudit.tsx       |  849 -------------
 src/sections/Footer.styles.ts                      |  354 ------
 src/sections/Footer.tsx                            |  279 -----
 src/sections/Game/Game.styles.ts                   |  986 ---------------
 src/sections/Game/Game.tsx                         |  854 -------------
 src/sections/Game/LoadingBar.tsx                   |   88 --
 src/sections/Game/ProvablyFairModal.tsx            |  298 -----
 src/sections/Game/TransactionModal.tsx             |  162 ---
 src/sections/Game/WagerControlsGlobalStyles.tsx    |   99 --
 src/sections/Header.styles.ts                      |  213 ----
 src/sections/Header.tsx                            |  343 ------
 src/sections/LeaderBoard/Icon.tsx                  |  183 ---
 .../LeaderBoard/LeaderboardsModal.styles.ts        |  346 ------
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |  129 --
 src/sections/LeaderBoard/Modal.tsx                 |  212 ----
 src/sections/RecentPlays/RecentPlays.styles.ts     |  180 ---
 src/sections/RecentPlays/RecentPlays.tsx           |  342 ------
 src/sections/RecentPlays/useRecentPlays.ts         |   86 --
 src/sections/RecentPlays/useRecentPlays.ts.backup  |   87 --
 src/sections/Toasts.styles.ts                      |  242 ----
 src/sections/Toasts.tsx                            |  334 ------
 src/sections/TokenSelect.styles.ts                 |  390 ------
 src/sections/TokenSelect.tsx                       |  533 ---------
 src/sections/UserButton.styles.ts                  |  266 -----
 src/sections/UserButton.tsx                        |  378 ------
 src/sections/UserProfile/UserProfile.styles.ts     |  220 ----
 src/sections/UserProfile/UserProfile.tsx           |  343 ------
 src/sections/walletConnect.ts                      |   27 -
 src/services/TokenPriceService.ts                  |  208 ----
 src/styles.css                                     |  444 -------
 src/styles.ts                                      |   55 -
 src/themes/ThemeContext.tsx                        |  111 --
 src/themes/globalThemes.ts                         |  772 ------------
 src/themes/themeUtils.ts                           |  191 ---
 src/utils.ts                                       |   31 -
 src/utils/cache/cache.ts                           |  106 --
 src/utils/cache/cacheMonitor.ts                    |  178 ---
 src/utils/general/emitChips.ts                     |    0
 src/utils/general/polyfills.ts                     |    0
 src/utils/general/prefetch.ts                      |  176 ---
 src/utils/general/preloading.ts                    |   73 --
 src/utils/general/timeAccess.ts                    |   67 --
 src/utils/performance/imageOptimization.ts         |  100 --
 src/utils/performance/performance.ts               |  105 --
 src/utils/performance/rafScheduler.ts              |   91 --
 src/utils/user/referralTier.ts                     |  118 --
 src/utils/user/userProfileUtils.ts                 |  171 ---
 src/utils/wallet/solanaWalletToast.ts              |  338 ------
 vercel.json                                        |   37 +
 407 files changed, 67 insertions(+), 54632 deletions(-)

Commit: 3664afd
Date: 2025-09-06
Old message: Updated APIs
 api/audit/edgeCases.ts                             |  306 +++++
 api/auth/auth.ts                                   |   74 ++
 api/cache/cache-admin.ts                           |  102 ++
 api/cache/cache-warmup.ts                          |   83 ++
 api/cache/xcache-edge.ts                           |  138 +++
 api/cache/xcacheOnTheFly.ts                        |  132 ++
 api/chat/chat.ts                                   |  192 +++
 api/dns/check-dns.ts                               |  151 +++
 api/services/coingecko.ts                          |   69 ++
 api/services/helius.ts                             |   44 +
 public/index.html                                  |   44 +
 public/manifest.webmanifest                        |   23 +
 public/png/games/blackjack-dual.png                |  Bin 0 -> 1361250 bytes
 public/png/games/blackjack.png                     |  Bin 0 -> 1739398 bytes
 public/png/games/crash.png                         |  Bin 0 -> 1908089 bytes
 public/png/games/dice.png                          |  Bin 0 -> 1493263 bytes
 public/png/games/flip-dual.png                     |  Bin 0 -> 1367197 bytes
 public/png/games/flip.png                          |  Bin 0 -> 1747803 bytes
 public/png/games/hilo.png                          |  Bin 0 -> 1587854 bytes
 public/png/games/lootbox.png                       |  Bin 0 -> 1690629 bytes
 public/png/games/mines.png                         |  Bin 0 -> 1320519 bytes
 public/png/games/multi-poker.png                   |  Bin 0 -> 1767777 bytes
 public/png/games/plinko-race.png                   |  Bin 0 -> 1249121 bytes
 public/png/games/plinko.png                        |  Bin 0 -> 1669948 bytes
 public/png/games/poker.png                         |  Bin 0 -> 1739398 bytes
 public/png/games/progressive-poker.png             |  Bin 0 -> 1383658 bytes
 public/png/games/roulette.png                      |  Bin 0 -> 1748292 bytes
 public/png/games/slots.png                         |  Bin 0 -> 1690629 bytes
 public/png/icons/favicon.ico                       |  Bin 0 -> 15406 bytes
 public/png/icons/favicon.png                       |  Bin 0 -> 23999 bytes
 public/png/icons/icon-192.png                      |  Bin 0 -> 26617 bytes
 public/png/icons/icon-512.png                      |  Bin 0 -> 128958 bytes
 public/png/images/$DGHRT.png                       |  Bin 0 -> 1597081 bytes
 public/png/images/casino.png                       |  Bin 0 -> 705686 bytes
 public/png/images/fakemoney.png                    |  Bin 0 -> 1744 bytes
 public/png/images/overlay-glow.png                 |  Bin 0 -> 1468219 bytes
 public/png/images/pfp.png                          |  Bin 0 -> 1778881 bytes
 public/png/images/seo.png                          |  Bin 0 -> 458602 bytes
 public/png/images/stuff.png                        |  Bin 0 -> 3264 bytes
 public/png/images/user.png                         |  Bin 0 -> 1597081 bytes
 public/sw.js                                       |  216 ++++
 public/webp/games/blackjack-dual.webp              |  Bin 0 -> 53132 bytes
 public/webp/games/blackjack.webp                   |  Bin 0 -> 88344 bytes
 public/webp/games/crash.webp                       |  Bin 0 -> 120508 bytes
 public/webp/games/dice.webp                        |  Bin 0 -> 62484 bytes
 public/webp/games/flip-dual.webp                   |  Bin 0 -> 46154 bytes
 public/webp/games/flip.webp                        |  Bin 0 -> 95248 bytes
 public/webp/games/hilo.webp                        |  Bin 0 -> 47422 bytes
 public/webp/games/lootbox.webp                     |  Bin 0 -> 68796 bytes
 public/webp/games/mines.webp                       |  Bin 0 -> 44152 bytes
 public/webp/games/multi-poker.webp                 |  Bin 0 -> 94530 bytes
 public/webp/games/plinko-race.webp                 |  Bin 0 -> 30272 bytes
 public/webp/games/plinko.webp                      |  Bin 0 -> 63658 bytes
 public/webp/games/poker.webp                       |  Bin 0 -> 88344 bytes
 public/webp/games/progressive-poker.webp           |  Bin 0 -> 59660 bytes
 public/webp/games/roulette.webp                    |  Bin 0 -> 93602 bytes
 public/webp/games/slots.webp                       |  Bin 0 -> 68796 bytes
 public/webp/icons/favicon.webp                     |  Bin 0 -> 9418 bytes
 public/webp/icons/icon-192.webp                    |  Bin 0 -> 10258 bytes
 public/webp/icons/icon-512.webp                    |  Bin 0 -> 37818 bytes
 public/webp/images/casino.webp                     |  Bin 0 -> 36894 bytes
 public/webp/images/fakemoney.webp                  |  Bin 0 -> 1176 bytes
 public/webp/images/overlay-glow.webp               |  Bin 0 -> 66868 bytes
 public/webp/images/pfp.webp                        |  Bin 0 -> 49382 bytes
 public/webp/images/seo.webp                        |  Bin 0 -> 18674 bytes
 public/webp/images/stuff.webp                      |  Bin 0 -> 1504 bytes
 public/webp/images/user.webp                       |  Bin 0 -> 114552 bytes
 screenshots/1.jpg                                  |  Bin 0 -> 211802 bytes
 screenshots/2.jpg                                  |  Bin 0 -> 284904 bytes
 screenshots/3.jpg                                  |  Bin 0 -> 322239 bytes
 scripts/compress-build.mjs                         |  136 +++
 src/App.tsx                                        |  278 +++++
 src/GlobalErrorBoundary.tsx                        |   34 +
 .../AllGamesModal/AllGamesModal.styles.ts          |  138 +++
 src/components/AllGamesModal/AllGamesModal.tsx     |   67 ++
 src/components/Bonus/Bonus.styles.ts               |  133 +++
 src/components/Bonus/BonusModal.tsx                |   67 ++
 src/components/Cache/Cache.styles.ts               |  109 ++
 src/components/Cache/CacheDebugPanel.tsx           |  174 +++
 src/components/Connection/Connection.styles.ts     |  244 ++++
 src/components/Connection/ConnectionStatus.tsx     |  316 +++++
 src/components/Connection/PropagationStatus.tsx    |   32 +
 src/components/Debug/CacheDebug.tsx                |  151 +++
 src/components/Dev/AdaptiveFpsOverlay.tsx          |   68 ++
 src/components/Dropdown/Dropdown.styles.ts         |   13 +
 src/components/Dropdown/Dropdown.tsx               |   66 +
 src/components/Explorer/Explorer.styles.ts         |   13 +
 src/components/Explorer/ExplorerHeader.tsx         |   94 ++
 src/components/Explorer/ExplorerIndex.tsx          |  190 +++
 src/components/Game/EnhancedGameControls.tsx       |  447 +++++++
 src/components/Game/Game.styles.ts                 |   13 +
 src/components/Game/GameScreenFrame.tsx            |  943 +++++++++++++++
 src/components/Game/GameSplashScreen.tsx           |  335 ++++++
 src/components/Game/GameplayFrame.tsx              |  195 +++
 src/components/Game/LazyGameLoader.tsx             |   60 +
 src/components/Graphics/Graphics.styles.ts         |   13 +
 src/components/Graphics/GraphicsSettings.tsx       |  398 ++++++
 src/components/Jackpot/Jackpot.styles.ts           |   13 +
 src/components/Jackpot/JackpotModal.tsx            |  371 ++++++
 src/components/Mobile/Mobile.styles.ts             |   13 +
 src/components/Mobile/MobileControls.tsx           | 1062 ++++++++++++++++
 src/components/Mobile/MobileGameControls.tsx       |  266 +++++
 src/components/Modal/ErrorModal.tsx                |  126 ++
 src/components/Modal/Modal.styles.ts               |  127 ++
 src/components/Modal/Modal.tsx                     |   94 ++
 src/components/Platform/Platform.styles.ts         |   13 +
 src/components/Platform/PlatformView.tsx           |  741 ++++++++++++
 src/components/Platform/PlayerView.tsx             |  456 +++++++
 .../Referral/CompactReferralLeaderboard.tsx        |  271 +++++
 .../Referral/FullReferralLeaderboard.tsx           |  314 +++++
 src/components/Referral/Referral.styles.ts         |   13 +
 src/components/Referral/ReferralDashboard.tsx      |  334 ++++++
 .../Referral/ReferralLeaderboardModal.tsx          |  478 ++++++++
 src/components/Settings/Settings.styles.ts         |  228 ++++
 src/components/Settings/SettingsModal.tsx          |  254 ++++
 src/components/Share/Share.styles.ts               |   13 +
 src/components/Share/ShareModal.tsx                |  378 ++++++
 src/components/Theme/Theme.styles.ts               |   13 +
 src/components/Theme/ThemeSelector.tsx             |  124 ++
 src/components/Transaction/EmbeddedTransaction.tsx |  153 +++
 src/components/Transaction/FeesTab.tsx             |  158 +++
 src/components/Transaction/Transaction.styles.ts   |   13 +
 src/components/Transaction/Transaction.tsx         | 1263 ++++++++++++++++++++
 src/components/UI/EnhancedTickerTape.tsx           |  357 ++++++
 src/components/UI/Icon.tsx                         |  183 +++
 src/components/UI/PriceIndicator.tsx               |  153 +++
 src/components/UI/ResponsiveImage.tsx              |   83 ++
 src/components/UI/Sidebar.tsx                      |  144 +++
 src/components/UI/Slider.tsx                       |   94 ++
 src/components/UI/SmartImage.tsx                   |   71 ++
 src/components/UI/TrollBox.tsx                     |  625 ++++++++++
 src/components/UI/UI.styles.ts                     |   13 +
 src/components/index.tsx                           |  114 ++
 src/constants.ts                                   |  366 ++++++
 src/constants/QuotesVault.ts                       |  185 +++
 src/constants/errorCodes.ts                        |   82 ++
 src/contexts/RefreshContext.tsx                    |   45 +
 src/fairness/deterministicRng.ts                   |   22 +
 .../BlackjackBackground.enhanced.styles.ts         | 1152 ++++++++++++++++++
 src/games/BlackJack/CardComponents.tsx             |  144 +++
 src/games/BlackJack/betArray.ts                    |    5 +
 src/games/BlackJack/card.mp3                       |  Bin 0 -> 4248 bytes
 src/games/BlackJack/constants.ts                   |   55 +
 src/games/BlackJack/index.tsx                      |  420 +++++++
 src/games/BlackJack/lose.mp3                       |  Bin 0 -> 21192 bytes
 src/games/BlackJack/play.mp3                       |  Bin 0 -> 17266 bytes
 src/games/BlackJack/styles.ts                      |   79 ++
 src/games/BlackJack/win.mp3                        |  Bin 0 -> 9452 bytes
 src/games/BlackJack/win2.mp3                       |  Bin 0 -> 24359 bytes
 .../CrashGame/CrashBackground.enhanced.styles.ts   |  267 +++++
 src/games/CrashGame/Slider.tsx                     |   99 ++
 src/games/CrashGame/constants.ts                   |    3 +
 src/games/CrashGame/crash.mp3                      |  Bin 0 -> 53637 bytes
 src/games/CrashGame/index.tsx                      |  201 ++++
 src/games/CrashGame/music.mp3                      |  Bin 0 -> 1394431 bytes
 src/games/CrashGame/rocket.gif                     |  Bin 0 -> 1853209 bytes
 src/games/CrashGame/rocket.webp                    |  Bin 0 -> 904948 bytes
 src/games/CrashGame/styles.ts                      |  135 +++
 src/games/CrashGame/utils.ts                       |    8 +
 src/games/CrashGame/win.mp3                        |  Bin 0 -> 86526 bytes
 src/games/Dice/DiceBackground.enhanced.styles.ts   |  486 ++++++++
 src/games/Dice/DiceBackground.styles.ts            |    0
 src/games/Dice/DicePhysics.tsx                     |  110 ++
 src/games/Dice/Slider.tsx                          |  128 ++
 src/games/Dice/constants.ts                        |    7 +
 src/games/Dice/index.tsx                           |  225 ++++
 src/games/Dice/lose.mp3                            |  Bin 0 -> 21192 bytes
 src/games/Dice/play.mp3                            |  Bin 0 -> 17266 bytes
 src/games/Dice/styles-new.ts                       |  291 +++++
 src/games/Dice/styles.ts                           |   93 ++
 src/games/Dice/tick.mp3                            |  Bin 0 -> 1440 bytes
 src/games/Dice/win.mp3                             |  Bin 0 -> 73992 bytes
 src/games/Flip/Coin.tsx                            |  150 +++
 src/games/Flip/Effect.tsx                          |   46 +
 src/games/Flip/FlipBackground.enhanced.styles.ts   |  685 +++++++++++
 src/games/Flip/betArrays.ts                        |    5 +
 src/games/Flip/coin.mp3                            |  Bin 0 -> 4652 bytes
 src/games/Flip/constants.ts                        |    5 +
 src/games/Flip/heads.png                           |  Bin 0 -> 310164 bytes
 src/games/Flip/heads.webp                          |  Bin 0 -> 42808 bytes
 src/games/Flip/index.tsx                           |  382 ++++++
 src/games/Flip/lose.mp3                            |  Bin 0 -> 10988 bytes
 src/games/Flip/star.png                            |  Bin 0 -> 2056 bytes
 src/games/Flip/star.webp                           |  Bin 0 -> 1098 bytes
 src/games/Flip/tails.png                           |  Bin 0 -> 310248 bytes
 src/games/Flip/tails.webp                          |  Bin 0 -> 42818 bytes
 src/games/Flip/win.mp3                             |  Bin 0 -> 9452 bytes
 src/games/HiLo/HiLoBackground.enhanced.styles.ts   |  253 ++++
 src/games/HiLo/betArray.ts                         |    5 +
 src/games/HiLo/card.mp3                            |  Bin 0 -> 4248 bytes
 src/games/HiLo/constants.ts                        |   27 +
 src/games/HiLo/finish.mp3                          |  Bin 0 -> 26952 bytes
 src/games/HiLo/index.tsx                           |  521 ++++++++
 src/games/HiLo/lose.mp3                            |  Bin 0 -> 21192 bytes
 src/games/HiLo/play.mp3                            |  Bin 0 -> 17266 bytes
 src/games/HiLo/styles.ts                           |  307 +++++
 src/games/HiLo/win.mp3                             |  Bin 0 -> 9452 bytes
 src/games/Mines/MinesBackground.enhanced.styles.ts |  267 +++++
 src/games/Mines/axe.mp3                            |  Bin 0 -> 15212 bytes
 src/games/Mines/betArray.ts                        |    5 +
 src/games/Mines/constants.ts                       |   10 +
 src/games/Mines/explode.mp3                        |  Bin 0 -> 32876 bytes
 src/games/Mines/finish.mp3                         |  Bin 0 -> 26952 bytes
 src/games/Mines/index.tsx                          |  505 ++++++++
 src/games/Mines/step.mp3                           |  Bin 0 -> 8684 bytes
 src/games/Mines/styles.ts                          |  297 +++++
 src/games/Mines/tick.mp3                           |  Bin 0 -> 64748 bytes
 src/games/Mines/types.ts                           |   11 +
 src/games/Mines/utils.ts                           |   42 +
 src/games/Mines/win.mp3                            |  Bin 0 -> 42476 bytes
 .../MultiPokerBackground.enhanced.styles.ts        |  391 ++++++
 src/games/MultiPoker/PokerCard.tsx                 |  135 +++
 src/games/MultiPoker/betArray.ts                   |   11 +
 src/games/MultiPoker/constants.ts                  |   21 +
 src/games/MultiPoker/index.tsx                     |  952 +++++++++++++++
 src/games/MultiPoker/sounds/card.mp3               |  Bin 0 -> 4248 bytes
 src/games/MultiPoker/sounds/lose.mp3               |  Bin 0 -> 21192 bytes
 src/games/MultiPoker/sounds/play.mp3               |  Bin 0 -> 17266 bytes
 src/games/MultiPoker/sounds/win.mp3                |  Bin 0 -> 9452 bytes
 src/games/MultiPoker/sounds/win2.mp3               |  Bin 0 -> 24359 bytes
 src/games/Plinko/BucketScoreboard.tsx              |  315 +++++
 .../Plinko/PlinkoBackground.enhanced.styles.ts     |  490 ++++++++
 src/games/Plinko/betArrays.ts                      |    6 +
 src/games/Plinko/binomialEngine.ts                 |  176 +++
 src/games/Plinko/bump.mp3                          |  Bin 0 -> 1440 bytes
 src/games/Plinko/constants.ts                      |    6 +
 src/games/Plinko/fall.mp3                          |  Bin 0 -> 10604 bytes
 src/games/Plinko/game.ts                           |  462 +++++++
 src/games/Plinko/index.tsx                         |  630 ++++++++++
 src/games/Plinko/styles.ts                         |    0
 src/games/Plinko/win.mp3                           |  Bin 0 -> 42476 bytes
 .../PlinkoRaceBackground.enhanced.styles.ts        |  397 ++++++
 src/games/PlinkoRace/board/Board.tsx               |  294 +++++
 src/games/PlinkoRace/board/BoardHUD.tsx            |   46 +
 src/games/PlinkoRace/board/BoardRenderer.tsx       |  424 +++++++
 src/games/PlinkoRace/board/Scoreboard.tsx          |  465 +++++++
 .../PlinkoRace/components/CreateGameModal.tsx      |  444 +++++++
 .../PlinkoRace/components/DebugGameScreen.tsx      |  350 ++++++
 src/games/PlinkoRace/components/GameScreen.tsx     |  284 +++++
 src/games/PlinkoRace/components/Lobby.tsx          |  515 ++++++++
 .../PlinkoRace/components/LobbyBackground.tsx      |  197 +++
 src/games/PlinkoRace/constants.ts                  |    5 +
 src/games/PlinkoRace/engine/PhysicsWorld.ts        |   84 ++
 src/games/PlinkoRace/engine/SimulationEngine.ts    |  392 ++++++
 src/games/PlinkoRace/engine/constants.ts           |   59 +
 src/games/PlinkoRace/engine/deterministic.ts       |   21 +
 src/games/PlinkoRace/engine/index.ts               |    5 +
 src/games/PlinkoRace/engine/types.ts               |   21 +
 src/games/PlinkoRace/hooks/useMultiPlinko.ts       |   35 +
 src/games/PlinkoRace/index.tsx                     |  261 ++++
 src/games/PlinkoRace/musicManager.ts               |   50 +
 src/games/PlinkoRace/sounds/action.mp3             |  Bin 0 -> 802733 bytes
 src/games/PlinkoRace/sounds/bigcombo.mp3           |  Bin 0 -> 7958 bytes
 src/games/PlinkoRace/sounds/bump.mp3               |  Bin 0 -> 1440 bytes
 src/games/PlinkoRace/sounds/extraball.mp3          |  Bin 0 -> 14266 bytes
 src/games/PlinkoRace/sounds/fall.mp3               |  Bin 0 -> 10604 bytes
 src/games/PlinkoRace/sounds/finsh.mp3              |  Bin 0 -> 6286 bytes
 src/games/PlinkoRace/sounds/lobby.mp3              |  Bin 0 -> 907244 bytes
 src/games/PlinkoRace/sounds/lobbymusic.mp3         |  Bin 0 -> 1200109 bytes
 src/games/PlinkoRace/sounds/ouch.mp3               |  Bin 0 -> 5696 bytes
 src/games/PlinkoRace/sounds/readygo.mp3            |  Bin 0 -> 18413 bytes
 src/games/PlinkoRace/sounds/win.mp3                |  Bin 0 -> 42476 bytes
 src/games/Roulette/Chip.tsx                        |   56 +
 src/games/Roulette/Roulette.styles.ts              |  212 ++++
 src/games/Roulette/Table.tsx                       |   62 +
 src/games/Roulette/chip.mp3                        |  Bin 0 -> 1831 bytes
 src/games/Roulette/constants.ts                    |   95 ++
 src/games/Roulette/index.tsx                       |  328 +++++
 src/games/Roulette/lose.mp3                        |  Bin 0 -> 21192 bytes
 src/games/Roulette/play.mp3                        |  Bin 0 -> 17266 bytes
 src/games/Roulette/signals.ts                      |   78 ++
 src/games/Roulette/win.mp3                         |  Bin 0 -> 9452 bytes
 src/games/Slots/ItemPreview.styles.ts              |  151 +++
 src/games/Slots/ItemPreview.tsx                    |   53 +
 src/games/Slots/Reel.tsx                           |  364 ++++++
 src/games/Slots/Slot.styles.ts                     |   66 +
 src/games/Slots/Slot.tsx                           |  119 ++
 src/games/Slots/SlotComponents.tsx                 |  275 +++++
 src/games/Slots/Slots.styles.ts                    |  615 ++++++++++
 src/games/Slots/SlotsBackground.enhanced.styles.ts |   62 +
 src/games/Slots/assets/coin.mp3                    |  Bin 0 -> 44012 bytes
 src/games/Slots/assets/insert.mp3                  |  Bin 0 -> 44012 bytes
 src/games/Slots/assets/lose.mp3                    |  Bin 0 -> 25032 bytes
 src/games/Slots/assets/money.mp3                   |  Bin 0 -> 119660 bytes
 src/games/Slots/assets/play.mp3                    |  Bin 0 -> 17266 bytes
 src/games/Slots/assets/reveal-legendary.mp3        |  Bin 0 -> 53996 bytes
 src/games/Slots/assets/reveal.mp3                  |  Bin 0 -> 42476 bytes
 src/games/Slots/assets/slot-bonk.png               |  Bin 0 -> 134126 bytes
 src/games/Slots/assets/slot-bonk.webp              |  Bin 0 -> 14868 bytes
 src/games/Slots/assets/slot-dghrt.png              |  Bin 0 -> 310164 bytes
 src/games/Slots/assets/slot-dghrt.webp             |  Bin 0 -> 42808 bytes
 src/games/Slots/assets/slot-jup.png                |  Bin 0 -> 28312 bytes
 src/games/Slots/assets/slot-jup.webp               |  Bin 0 -> 7522 bytes
 src/games/Slots/assets/slot-legendary.png          |  Bin 0 -> 1013150 bytes
 src/games/Slots/assets/slot-legendary.webp         |  Bin 0 -> 123642 bytes
 src/games/Slots/assets/slot-mythical.png           |  Bin 0 -> 953452 bytes
 src/games/Slots/assets/slot-mythical.webp          |  Bin 0 -> 130430 bytes
 src/games/Slots/assets/slot-sol.png                |  Bin 0 -> 111290 bytes
 src/games/Slots/assets/slot-sol.webp               |  Bin 0 -> 9058 bytes
 src/games/Slots/assets/slot-unicorn.png            |  Bin 0 -> 106788 bytes
 src/games/Slots/assets/slot-unicorn.webp           |  Bin 0 -> 27296 bytes
 src/games/Slots/assets/slot-usdc.png               |  Bin 0 -> 9276 bytes
 src/games/Slots/assets/slot-usdc.webp              |  Bin 0 -> 5534 bytes
 src/games/Slots/assets/slot-wojak.png              |  Bin 0 -> 185454 bytes
 src/games/Slots/assets/slot-wojak.webp             |  Bin 0 -> 22748 bytes
 src/games/Slots/assets/spin.mp3                    |  Bin 0 -> 108140 bytes
 src/games/Slots/assets/win.mp3                     |  Bin 0 -> 69864 bytes
 src/games/Slots/constants.ts                       |   54 +
 src/games/Slots/index.tsx                          |  314 +++++
 src/games/Slots/utils.ts                           |  253 ++++
 src/games/allGames.ts                              |  146 +++
 src/games/featuredGames.ts                         |    7 +
 src/games/getVisibleGames.ts                       |   20 +
 src/games/index.tsx                                |    1 +
 src/games/rtpConfig.ts                             |  822 +++++++++++++
 src/games/types.ts                                 |   18 +
 src/games/useGameMeta.ts                           |    6 +
 src/hooks/analytics/useReferralAnalytics.ts        |   65 +
 src/hooks/data/useLeaderboardData.ts               |   80 ++
 src/hooks/data/useTokenPriceChanges.ts             |  144 +++
 src/hooks/data/useTokenPriceService.ts             |   50 +
 src/hooks/data/useTokenPrices.ts                   |   40 +
 src/hooks/data/useUserStore.ts                     |   90 ++
 src/hooks/game/useGameOutcome.ts                   |   76 ++
 src/hooks/game/useGameplayEffects.ts               |  196 +++
 src/hooks/system/usePrefetch.ts                    |  217 ++++
 src/hooks/system/useServiceWorker.ts               |   93 ++
 src/hooks/ui/useIsCompact.ts                       |   27 +
 src/hooks/ui/useMediaQuery.ts                      |   30 +
 src/hooks/ui/useOnClickOutside.ts                  |   21 +
 src/hooks/ui/useOutsideClick.ts                    |   17 +
 src/hooks/ui/useToast.ts                           |   37 +
 src/index.tsx                                      |  119 ++
 src/pages/features/BonusPage.tsx                   |  128 ++
 src/pages/features/JackpotPage.tsx                 |  128 ++
 src/pages/features/LeaderboardPage.tsx             |  161 +++
 src/pages/features/SelectTokenPage.tsx             |  165 +++
 src/pages/system/propagation.tsx                   |  696 +++++++++++
 src/sections/Dashboard/AboutMe/AboutMe.styles.ts   |  256 ++++
 src/sections/Dashboard/AboutMe/AboutMe.tsx         |   71 ++
 src/sections/Dashboard/Dashboard.styles.ts         |  374 ++++++
 src/sections/Dashboard/Dashboard.tsx               |  168 +++
 src/sections/Dashboard/FairnessAudit.tsx           |  849 +++++++++++++
 .../FeaturedGameCard/FeaturedGameCard.styles.ts    |   85 ++
 .../FeaturedGameCard/FeaturedGameCard.tsx          |   25 +
 .../FeaturedInlineGame.styles.ts                   |   29 +
 .../FeaturedInlineGame/FeaturedInlineGame.tsx      |   49 +
 src/sections/Dashboard/GameCard.styles.ts          |  152 +++
 src/sections/Dashboard/GameCard.tsx                |  124 ++
 src/sections/Dashboard/Terms/Terms.styles.ts       |  224 ++++
 src/sections/Dashboard/Terms/Terms.tsx             |  177 +++
 .../WelcomeBanner/WelcomeBanner.styles.ts          |  429 +++++++
 .../Dashboard/WelcomeBanner/WelcomeBanner.tsx      |  103 ++
 .../Dashboard/Whitepaper/Whitepaper.styles.ts      |  162 +++
 src/sections/Dashboard/Whitepaper/Whitepaper.tsx   |  121 ++
 src/sections/FairnessAudit/FairnessAudit.styles.ts | 1050 ++++++++++++++++
 src/sections/FairnessAudit/FairnessAudit.tsx       |  849 +++++++++++++
 src/sections/Footer.styles.ts                      |  354 ++++++
 src/sections/Footer.tsx                            |  279 +++++
 src/sections/Game/Game.styles.ts                   |  986 +++++++++++++++
 src/sections/Game/Game.tsx                         |  854 +++++++++++++
 src/sections/Game/LoadingBar.tsx                   |   88 ++
 src/sections/Game/ProvablyFairModal.tsx            |  298 +++++
 src/sections/Game/TransactionModal.tsx             |  162 +++
 src/sections/Game/WagerControlsGlobalStyles.tsx    |   99 ++
 src/sections/Header.styles.ts                      |  213 ++++
 src/sections/Header.tsx                            |  343 ++++++
 src/sections/LeaderBoard/Icon.tsx                  |  183 +++
 .../LeaderBoard/LeaderboardsModal.styles.ts        |  346 ++++++
 src/sections/LeaderBoard/LeaderboardsModal.tsx     |  129 ++
 src/sections/LeaderBoard/Modal.tsx                 |  212 ++++
 src/sections/RecentPlays/RecentPlays.styles.ts     |  180 +++
 src/sections/RecentPlays/RecentPlays.tsx           |  342 ++++++
 src/sections/RecentPlays/useRecentPlays.ts         |   86 ++
 src/sections/RecentPlays/useRecentPlays.ts.backup  |   87 ++
 src/sections/Toasts.styles.ts                      |  242 ++++
 src/sections/Toasts.tsx                            |  334 ++++++
 src/sections/TokenSelect.styles.ts                 |  390 ++++++
 src/sections/TokenSelect.tsx                       |  533 +++++++++
 src/sections/UserButton.styles.ts                  |  266 +++++
 src/sections/UserButton.tsx                        |  378 ++++++
 src/sections/UserProfile/UserProfile.styles.ts     |  220 ++++
 src/sections/UserProfile/UserProfile.tsx           |  343 ++++++
 src/sections/walletConnect.ts                      |   27 +
 src/services/TokenPriceService.ts                  |  208 ++++
 src/styles.css                                     |  444 +++++++
 src/styles.ts                                      |   55 +
 src/themes/ThemeContext.tsx                        |  111 ++
 src/themes/globalThemes.ts                         |  772 ++++++++++++
 src/themes/themeUtils.ts                           |  191 +++
 src/utils.ts                                       |   31 +
 src/utils/cache/cache.ts                           |  106 ++
 src/utils/cache/cacheMonitor.ts                    |  178 +++
 src/utils/general/emitChips.ts                     |    0
 src/utils/general/polyfills.ts                     |    0
 src/utils/general/prefetch.ts                      |  176 +++
 src/utils/general/preloading.ts                    |   73 ++
 src/utils/general/timeAccess.ts                    |   67 ++
 src/utils/performance/imageOptimization.ts         |  100 ++
 src/utils/performance/performance.ts               |  105 ++
 src/utils/performance/rafScheduler.ts              |   91 ++
 src/utils/user/referralTier.ts                     |  118 ++
 src/utils/user/userProfileUtils.ts                 |  171 +++
 src/utils/wallet/solanaWalletToast.ts              |  338 ++++++
 404 files changed, 54865 insertions(+)

Commit: 40a9c02
Date: 2025-09-06
Old message: Updated APIs
 .well-known/security.txt                 |   3 +
 SECURITY.md                              |  21 +++
 index.html                               |  50 --------
 package-lock.json                        | 211 +++++++++++++++++--------------
 package.json                             |   2 +
 public/index.html                        |   9 +-
 public/sw.js                             |  16 ++-
 src/sections/UserProfile/UserProfile.tsx |   2 +-
 src/utils/crypto/verifyEd25519.ts        |  34 +++++
 vercel.json                              |   2 +-
 10 files changed, 194 insertions(+), 156 deletions(-)

Commit: c9a2e99
Date: 2025-09-06
Old message: Updated APIs
 index.html | 49 +++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 49 insertions(+)

Commit: e8205e1
Date: 2025-09-06
Old message: Updated APIs
 .gitignore                     |  15 +-
 src/App.tsx                    |   2 +
 src/pages/system/AdminPage.tsx | 352 +++++++++++++++++++++++++++++++++++++++++
 3 files changed, 356 insertions(+), 13 deletions(-)

Commit: 0cd7aa6
Date: 2025-09-06
Old message: Updated APIs
 src/components/UI/Sidebar.tsx  |  2 +-
 src/constants.ts               | 10 ++++++++++
 src/pages/system/AdminPage.tsx | 29 ++++++++++++++++++++++++++++-
 3 files changed, 39 insertions(+), 2 deletions(-)

Commit: 3649c6d
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 3 +++
 1 file changed, 3 insertions(+)

Commit: ec3dafb
Date: 2025-09-06
Old message: Updated APIs
 .gitignore                     |   2 -
 ADMIN_URL_COMMANDS.md          | 202 +++++++++++++++++++++++
 src/pages/system/AdminPage.tsx | 355 ++++++++++++++++++++++++++++++++++++++---
 3 files changed, 537 insertions(+), 22 deletions(-)

Commit: 57185df
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 41 ++++++++++++++++++++++++++++++++++++-----
 1 file changed, 36 insertions(+), 5 deletions(-)

Commit: 87597fa
Date: 2025-09-06
Old message: Updated APIs
 ADMIN_URL_COMMANDS.md          | 202 ---------------------
 src/pages/system/AdminPage.tsx | 400 ++++++-----------------------------------
 2 files changed, 57 insertions(+), 545 deletions(-)

Commit: a49fe49
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 8 +++++++-
 1 file changed, 7 insertions(+), 1 deletion(-)

Commit: da31c4b
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 9 +++------
 1 file changed, 3 insertions(+), 6 deletions(-)

Commit: ae2fc33
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 2 --
 1 file changed, 2 deletions(-)

Commit: 7cd04e9
Date: 2025-09-06
Old message: Updated APIs
 api/admin/blacklist.ts         |  73 +++++++
 api/admin/games.ts             |  56 +++++
 api/admin/jackpots.ts          |  53 +++++
 api/admin/transactions.ts      |  56 +++++
 api/admin/wallets.ts           |  78 +++++++
 api/cache/cache-admin.ts       |  22 +-
 api/cache/cache-warmup.ts      |  21 +-
 api/dns/check-dns.ts           |  40 +++-
 api/services/coingecko.ts      |  22 +-
 src/pages/system/AdminPage.tsx | 455 ++++++++++++++++++++++++++++++++++++++++-
 10 files changed, 864 insertions(+), 12 deletions(-)

Commit: 738a4be
Date: 2025-09-06
Old message: Updated APIs
 api/admin/analytics.ts         | 121 +++++++++++++++++++++++++++++++++++++++++
 api/admin/blacklist.ts         |  73 -------------------------
 api/admin/content.ts           | 107 ++++++++++++++++++++++++++++++++++++
 src/games/getVisibleGames.ts   |  27 ++++++++-
 src/pages/system/AdminPage.tsx |  52 +++++++++++++++---
 src/utils/analyticsUtils.ts    | 102 ++++++++++++++++++++++++++++++++++
 src/utils/contentUtils.ts      |  64 ++++++++++++++++++++++
 7 files changed, 463 insertions(+), 83 deletions(-)

Commit: f388b13
Date: 2025-09-06
Old message: Updated APIs
 api/admin/analytics.ts         | 121 -----------------------------------------
 src/pages/system/AdminPage.tsx |  21 -------
 src/utils/analyticsUtils.ts    | 102 ----------------------------------
 3 files changed, 244 deletions(-)

Commit: 2d3a584
Date: 2025-09-06
Old message: Updated APIs
 api/admin/content.ts           | 107 ----------------------------------------
 src/games/getVisibleGames.ts   |  27 +---------
 src/pages/system/AdminPage.tsx | 109 ++++-------------------------------------
 src/utils/contentUtils.ts      |  64 ------------------------
 4 files changed, 11 insertions(+), 296 deletions(-)

Commit: a2d2d5b
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 127 ++++++++++++++++++++++++++++++++++-------
 1 file changed, 106 insertions(+), 21 deletions(-)

Commit: 99ea3bb
Date: 2025-09-06
Old message: Updated APIs
 src/pages/system/AdminPage.tsx | 16 +++++++++++-----
 1 file changed, 11 insertions(+), 5 deletions(-)

Commit: a277b28
Date: 2025-09-06
Old message: Updated APIs
 api/admin/content.ts           |   0
 api/admin/games.ts             |  56 -----
 api/admin/jackpots.ts          |  53 -----
 api/admin/transactions.ts      |  56 -----
 api/admin/wallets.ts           |  78 -------
 api/cache/cache-admin.ts       |  22 +-
 api/cache/cache-warmup.ts      |  21 +-
 api/dns/check-dns.ts           |  40 +---
 api/services/coingecko.ts      |  22 +-
 src/pages/system/AdminPage.tsx | 472 +----------------------------------------
 src/utils/contentUtils.ts      |   0
 11 files changed, 13 insertions(+), 807 deletions(-)

Commit: 9b37ddf
Date: 2025-09-06
Old message: Updated APIs
 public/png/images/logo.png             | Bin 0 -> 173969 bytes
 src/games/BlackJack/CardComponents.tsx |   5 +++++
 src/games/MultiPoker/PokerCard.tsx     |  12 ++++++++++++
 3 files changed, 17 insertions(+)

Commit: 5425d8b
Date: 2025-09-06
Old message: Updated APIs
 src/games/MultiPoker/PokerCard.tsx | 18 ++++++++----------
 1 file changed, 8 insertions(+), 10 deletions(-)

Commit: c4cdfaa
Date: 2025-09-06
Old message: Updated APIs
 public/png/images/card.png             | Bin 0 -> 2933481 bytes
 src/games/BlackJack/CardComponents.tsx |  19 +++++++++----------
 src/games/MultiPoker/PokerCard.tsx     |  24 ++++++------------------
 3 files changed, 15 insertions(+), 28 deletions(-)

Commit: 66eff96
Date: 2025-09-06
Old message: Updated APIs
 src/games/BlackJack/CardComponents.tsx | 6 ++++--
 src/games/MultiPoker/PokerCard.tsx     | 6 ++++--
 2 files changed, 8 insertions(+), 4 deletions(-)

Commit: 3636db9
Date: 2025-09-06
Old message: Updated APIs
 src/games/BlackJack/CardComponents.tsx | 4 ++--
 src/games/MultiPoker/PokerCard.tsx     | 4 ++--
 2 files changed, 4 insertions(+), 4 deletions(-)

Commit: 7f85914
Date: 2025-09-06
Old message: Updated APIs
 public/png/images/card.png | Bin 2933481 -> 2948483 bytes
 1 file changed, 0 insertions(+), 0 deletions(-)

Commit: f7c80c5
Date: 2025-09-06
Old message: Updated APIs
 public/png/images/card.png         | Bin 2948483 -> 2917658 bytes
 src/games/MultiPoker/PokerCard.tsx |   2 +-
 2 files changed, 1 insertion(+), 1 deletion(-)

Commit: fb4105f
Date: 2025-09-06
Old message: Updated APIs
 src/games/MultiPoker/PokerCard.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

Commit: 357d4ec
Date: 2025-09-07
Old message: Updated APIs
 package.json                   |   3 +-
 scripts/generate-changelog.mjs | 453 +++++++++++++++++++++++++++++++++++++++++
 2 files changed, 455 insertions(+), 1 deletion(-)
