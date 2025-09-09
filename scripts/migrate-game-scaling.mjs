#!/usr/bin/env node
/**
 * Game Scaling Migration Script
 * 
 * This script helps migrate existing games to use the new GameScalingContext
 * and ScaledGameContainer components for optimal space utilization.
 * 
 * Usage:
 *   node scripts/migrate-game-scaling.mjs [game-name]
 *   
 * Examples:
 *   node scripts/migrate-game-scaling.mjs Plinko
 *   node scripts/migrate-game-scaling.mjs --all
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const GAMES_DIR = path.join(__dirname, '../src/games')

// Migration patterns for common transformations
const MIGRATION_PATTERNS = {
  // Add scaling context import
  addScalingImport: {
    search: /^(import.*from '\.\.\/\.\.\/components')/m,
    replace: (match) => `${match}\nimport { useGameScaling } from '../../contexts/GameScalingContext'`
  },
  
  // Replace manual container sizing with scaling context
  replaceContainerSizing: {
    search: /const \[containerSize, setContainerSize\] = React\.useState\([^)]+\)/,
    replace: 'const { dimensions, scale } = useGameScaling()\n  const containerSize = React.useMemo(() => ({ width: dimensions.width, height: dimensions.height }), [dimensions.width, dimensions.height])'
  },
  
  // Remove ResizeObserver when replaced by scaling system
  removeResizeObserver: {
    search: /React\.useEffect\(\(\) => \{[\s\S]*?ResizeObserver[\s\S]*?\}, \[\]\)/m,
    replace: '// Container sizing now handled by GameScalingContext'
  },
  
  // Add CSS custom properties usage
  addCSSCustomProperties: {
    search: /(width: )(\d+)(px)?/g,
    replace: '$1var(--game-screen-width, $2px)'
  }
}

// Games that use Canvas/Three.js and benefit from canvas scaling
const CANVAS_GAMES = ['Plinko', 'Flip', 'Mines', 'Roulette', 'CrashGame', 'PlinkoRace']

// Games that use mainly DOM elements
const DOM_GAMES = ['Slots', 'BlackJack', 'HiLo', 'Dice', 'MultiPoker']

/**
 * Get list of all game directories
 */
async function getGameDirectories() {
  try {
    const entries = await fs.readdir(GAMES_DIR, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  } catch (error) {
    console.error('Error reading games directory:', error)
    return []
  }
}

/**
 * Check if a game file exists and is readable
 */
async function checkGameFile(gameName) {
  const gameFile = path.join(GAMES_DIR, gameName, 'index.tsx')
  try {
    await fs.access(gameFile)
    return gameFile
  } catch {
    return null
  }
}

/**
 * Analyze a game file to determine what migrations are needed
 */
async function analyzeGameFile(gameFile) {
  const content = await fs.readFile(gameFile, 'utf-8')
  
  const analysis = {
    hasScalingImport: content.includes('useGameScaling'),
    hasScalingContext: content.includes('GameScalingContext'),
    hasManualSizing: content.includes('setContainerSize') || content.includes('ResizeObserver'),
    hasCanvas: content.includes('@react-three/fiber') || content.includes('Canvas'),
    hasThreeJS: content.includes('@react-three/'),
    needsMigration: false,
    suggestedActions: []
  }
  
  // Determine if migration is needed
  if (!analysis.hasScalingImport && analysis.hasManualSizing) {
    analysis.needsMigration = true
    analysis.suggestedActions.push('Add useGameScaling import')
    analysis.suggestedActions.push('Replace manual container sizing')
  }
  
  if (analysis.hasCanvas && !analysis.hasScalingContext) {
    analysis.needsMigration = true
    analysis.suggestedActions.push('Add canvas scaling utilities')
  }
  
  return analysis
}

/**
 * Generate migration recommendations for a game
 */
function generateMigrationPlan(gameName, analysis) {
  const plan = {
    game: gameName,
    priority: 'medium',
    actions: [],
    codeChanges: []
  }
  
  if (CANVAS_GAMES.includes(gameName)) {
    plan.priority = 'high'
    plan.actions.push('Integrate canvas scaling utilities')
    plan.codeChanges.push({
      description: 'Add useCanvasScaling hook for Three.js components',
      example: `
// Add this import
import { useCanvasScaling } from '../../components/Game/ScaledGameContainer'

// In your component
const { canvasWidth, canvasHeight, pixelRatio } = useCanvasScaling()

// Update Canvas size
<Canvas 
  style={{ width: canvasWidth, height: canvasHeight }}
  dpr={pixelRatio}
>
`
    })
  }
  
  if (analysis.hasManualSizing) {
    plan.actions.push('Replace manual ResizeObserver with scaling context')
    plan.codeChanges.push({
      description: 'Replace manual container sizing',
      example: `
// Replace this:
const [containerSize, setContainerSize] = useState({ width: 800, height: 400 })

// With this:
const { width, height, scale } = useGameScaling()
const containerSize = useMemo(() => ({
  width,
  height
}), [width, height])
`
    })
  }
  
  return plan
}

/**
 * Create a backup of the original file
 */
async function createBackup(gameFile) {
  const backupFile = gameFile.replace('.tsx', '.backup.tsx')
  await fs.copyFile(gameFile, backupFile)
  return backupFile
}

/**
 * Apply automatic migrations where safe
 */
async function applyAutomaticMigrations(gameFile, analysis) {
  let content = await fs.readFile(gameFile, 'utf-8')
  let changes = []
  
  // Add scaling import if missing
  if (!analysis.hasScalingImport && analysis.hasManualSizing) {
    const importMatch = content.match(/^(import.*from '\.\.\/\.\.\/components')/m)
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        `${importMatch[0]}\nimport { useGameScaling } from '../../contexts/GameScalingContext'`
      )
      changes.push('Added useGameScaling import')
    }
  }
  
  // Replace simple container sizing patterns
  const containerSizePattern = /const \[containerSize, setContainerSize\] = React\.useState\(\{ width: \d+, height: \d+ \}\)/
  if (containerSizePattern.test(content)) {
    content = content.replace(
      containerSizePattern,
      `const { width, height } = useGameScaling()
  const containerSize = React.useMemo(() => ({
    width,
    height
  }), [width, height])`
    )
    changes.push('Replaced manual container sizing with scaling context')
  }
  
  if (changes.length > 0) {
    await fs.writeFile(gameFile, content)
  }
  
  return changes
}

/**
 * Main migration function
 */
async function migrateGame(gameName) {
  console.log(`\n🔄 Analyzing ${gameName}...`)
  
  const gameFile = await checkGameFile(gameName)
  if (!gameFile) {
    console.log(`❌ Game file not found: ${gameName}/index.tsx`)
    return
  }
  
  const analysis = await analyzeGameFile(gameFile)
  console.log(`📊 Analysis results:`, analysis)
  
  if (!analysis.needsMigration) {
    console.log(`✅ ${gameName} is already using the scaling system or doesn't need migration`)
    return
  }
  
  const migrationPlan = generateMigrationPlan(gameName, analysis)
  console.log(`📋 Migration plan for ${gameName}:`)
  console.log(`   Priority: ${migrationPlan.priority}`)
  console.log(`   Actions needed:`)
  migrationPlan.actions.forEach(action => console.log(`   - ${action}`))
  
  // Create backup
  const backupFile = await createBackup(gameFile)
  console.log(`💾 Created backup: ${path.basename(backupFile)}`)
  
  // Apply automatic migrations
  const changes = await applyAutomaticMigrations(gameFile, analysis)
  if (changes.length > 0) {
    console.log(`✨ Applied automatic changes:`)
    changes.forEach(change => console.log(`   - ${change}`))
  }
  
  // Show manual migration steps
  if (migrationPlan.codeChanges.length > 0) {
    console.log(`\n🔧 Manual changes needed:`)
    migrationPlan.codeChanges.forEach((change, index) => {
      console.log(`\n${index + 1}. ${change.description}`)
      console.log(change.example)
    })
  }
  
  console.log(`\n✅ Migration completed for ${gameName}`)
}

/**
 * Main script execution
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🎮 Game Scaling Migration Script

Usage:
  node migrate-game-scaling.mjs <game-name>  # Migrate specific game
  node migrate-game-scaling.mjs --all        # Analyze all games
  node migrate-game-scaling.mjs --list       # List all games

Examples:
  node migrate-game-scaling.mjs Plinko
  node migrate-game-scaling.mjs --all
`)
    return
  }
  
  const games = await getGameDirectories()
  
  if (args[0] === '--list') {
    console.log('📁 Available games:')
    games.forEach(game => console.log(`  - ${game}`))
    return
  }
  
  if (args[0] === '--all') {
    console.log('🔍 Analyzing all games...')
    for (const game of games) {
      await migrateGame(game)
    }
    
    console.log('\n📊 Migration Summary:')
    console.log('High priority (Canvas/Three.js games):')
    CANVAS_GAMES.filter(game => games.includes(game)).forEach(game => console.log(`  - ${game}`))
    console.log('Medium priority (DOM games):')
    DOM_GAMES.filter(game => games.includes(game)).forEach(game => console.log(`  - ${game}`))
    
    return
  }
  
  // Migrate specific game
  const gameName = args[0]
  if (!games.includes(gameName)) {
    console.log(`❌ Game '${gameName}' not found. Available games:`)
    games.forEach(game => console.log(`  - ${game}`))
    return
  }
  
  await migrateGame(gameName)
}

// Run the script
main().catch(console.error)
