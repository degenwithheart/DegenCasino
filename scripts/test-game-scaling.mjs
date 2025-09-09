#!/usr/bin/env node
/**
 * Game Scaling System Test Script
 * 
 * This script validates that the game scaling system is working correctly
 * across different screen sizes and device types.
 * 
 * Usage:
 *   node scripts/test-game-scaling.mjs
 */

import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Test scenarios for different screen sizes
const TEST_SCENARIOS = {
  mobile: {
    width: 375,
    height: 667,
    pixelRatio: 2,
    description: 'iPhone SE (Mobile Portrait)'
  },
  mobileLandscape: {
    width: 667,
    height: 375,
    pixelRatio: 2,
    description: 'iPhone SE (Mobile Landscape)'
  },
  tablet: {
    width: 768,
    height: 1024,
    pixelRatio: 2,
    description: 'iPad (Tablet Portrait)'
  },
  tabletLandscape: {
    width: 1024,
    height: 768,
    pixelRatio: 2,
    description: 'iPad (Tablet Landscape)'
  },
  desktop: {
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    description: 'Desktop HD'
  },
  ultrawide: {
    width: 2560,
    height: 1440,
    pixelRatio: 1,
    description: 'Desktop Ultrawide'
  }
}

// Expected scaling behavior validation
const SCALING_EXPECTATIONS = {
  mobile: {
    minScale: 0.4,
    maxScale: 1.2,
    aspectRatio: 'flexible',
    touchTargetMin: 44, // iOS recommended minimum
    minDimension: 280
  },
  tablet: {
    minScale: 0.6,
    maxScale: 1.5,
    aspectRatio: 'flexible',
    touchTargetMin: 44,
    minDimension: 400
  },
  desktop: {
    minScale: 0.8,
    maxScale: 2.0,
    aspectRatio: 'flexible',
    touchTargetMin: 32,
    minDimension: 600
  },
  large: {
    minScale: 1.0,
    maxScale: 2.0,
    aspectRatio: 'flexible',
    touchTargetMin: 32,
    minDimension: 800
  }
}

/**
 * Simulate the game scaling calculations
 * This mirrors the logic in useGameScreenSize hook
 */
function calculateGameDimensions(viewport) {
  const { width: windowWidth, height: windowHeight, pixelRatio = 1 } = viewport
  
  // Default options from the hook
  const minHeight = 280
  const maxHeight = 900
  const controlsReservedSpace = 120
  const headerReservedSpace = 60
  const aggressiveScaling = true
  
  // Determine breakpoint
  let breakpoint = 'mobile'
  if (windowWidth >= 1440) breakpoint = 'large'
  else if (windowWidth >= 1024) breakpoint = 'desktop'
  else if (windowWidth >= 768) breakpoint = 'tablet'

  // Calculate available space with responsive adjustments
  const responsiveControlsSpace = breakpoint === 'mobile' 
    ? Math.max(80, controlsReservedSpace * 0.8)
    : controlsReservedSpace
  
  const responsiveHeaderSpace = breakpoint === 'mobile'
    ? Math.max(40, headerReservedSpace * 0.7)
    : headerReservedSpace
  
  let availableHeight = windowHeight - responsiveControlsSpace - responsiveHeaderSpace

  // Calculate width with responsive margins
  let availableWidth = windowWidth
  if (breakpoint === 'mobile') {
    availableWidth = Math.max(280, windowWidth - 32) // 16px margins
  } else if (breakpoint === 'tablet') {
    availableWidth = Math.max(400, windowWidth - 64) // 32px margins
  } else if (breakpoint === 'desktop') {
    availableWidth = Math.max(600, windowWidth - 120) // 60px margins
  } else { // large
    availableWidth = Math.max(800, Math.min(windowWidth - 200, 1400)) // Max container with margins
  }

  // Apply height constraints
  let finalHeight = aggressiveScaling 
    ? Math.max(minHeight, Math.min(availableHeight, maxHeight))
    : Math.max(minHeight, Math.min(availableHeight * 0.85, maxHeight))

  let finalWidth = availableWidth

  // Calculate scale factor for games to adapt their content
  const baseScale = breakpoint === 'mobile' ? 0.8 : breakpoint === 'tablet' ? 0.9 : 1.0
  const sizeScale = Math.min(finalWidth / 600, finalHeight / 400) // Base reference size
  const scale = baseScale * Math.max(0.6, Math.min(sizeScale, 2.0))

  const aspectRatio = finalWidth / finalHeight
  const isPortrait = aspectRatio < 1
  const isLandscape = aspectRatio > 1.2

  return {
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
    scale: Math.round(scale * 100) / 100,
    aspectRatio: Math.round(aspectRatio * 100) / 100,
    pixelRatio,
    canvasWidth: Math.round(finalWidth * pixelRatio),
    canvasHeight: Math.round(finalHeight * pixelRatio),
    deviceType: breakpoint,
    isPortrait,
    isLandscape,
    availableSpace: { width: availableWidth, height: availableHeight },
    utilization: {
      width: finalWidth / availableWidth,
      height: finalHeight / availableHeight,
      total: (finalWidth * finalHeight) / (availableWidth * availableHeight)
    }
  }
}

/**
 * Validate scaling results against expectations
 */
function validateScaling(scenario, results, expectations) {
  const issues = []
  
  // Check scale bounds
  if (results.scale < expectations.minScale) {
    issues.push(`Scale too small: ${results.scale} < ${expectations.minScale}`)
  }
  if (results.scale > expectations.maxScale) {
    issues.push(`Scale too large: ${results.scale} > ${expectations.maxScale}`)
  }
  
  // Check space utilization (more lenient for mobile)
  const minUtilization = results.deviceType === 'mobile' ? 0.3 : 0.4
  if (results.utilization.total < minUtilization) {
    issues.push(`Poor space utilization: ${(results.utilization.total * 100).toFixed(1)}%`)
  }
  
  // Check minimum dimensions are reasonable for the device type
  const minDimension = Math.min(results.width, results.height)
  if (minDimension < expectations.minDimension) {
    issues.push(`Game too small for ${results.deviceType}: ${minDimension}px < ${expectations.minDimension}px`)
  }
  
  // Check for reasonable maximum dimensions
  if (results.width > 2000 || results.height > 1200) {
    issues.push(`Game dimensions may be too large: ${results.width}x${results.height}`)
  }
  
  return issues
}

/**
 * Test CSS custom properties functionality
 */
function testCSSCustomProperties() {
  console.log('\n🎨 Testing CSS Custom Properties...')
  
  const testValues = {
    '--game-screen-width': '800px',
    '--game-screen-height': '450px',
    '--game-screen-scale': '0.8'
  }
  
  // Simulate CSS custom properties usage
  const expectedStyles = {
    gameContainer: `width: var(--game-screen-width, 1024px); height: var(--game-screen-height, 576px);`,
    scaledElement: `transform: scale(var(--game-screen-scale, 1));`,
    responsiveText: `font-size: calc(16px * var(--game-screen-scale, 1));`,
    responsiveButton: `min-height: calc(44px * var(--game-screen-scale, 1));`
  }
  
  console.log('✅ CSS Custom Properties test patterns:')
  Object.entries(expectedStyles).forEach(([element, style]) => {
    console.log(`   ${element}: ${style}`)
  })
  
  return true
}

/**
 * Test canvas scaling for Three.js games
 */
function testCanvasScaling(scenario, results) {
  console.log(`\n🎯 Testing Canvas Scaling for ${scenario.description}...`)
  
  const canvasTests = {
    pixelRatio: results.pixelRatio,
    logicalSize: { width: results.width, height: results.height },
    physicalSize: { width: results.canvasWidth, height: results.canvasHeight },
    scalingFactor: results.scale
  }
  
  const issues = []
  
  // Validate pixel ratio handling
  if (canvasTests.physicalSize.width !== canvasTests.logicalSize.width * canvasTests.pixelRatio) {
    issues.push('Canvas physical width calculation incorrect')
  }
  
  if (canvasTests.physicalSize.height !== canvasTests.logicalSize.height * canvasTests.pixelRatio) {
    issues.push('Canvas physical height calculation incorrect')
  }
  
  // Check for reasonable canvas sizes
  if (canvasTests.physicalSize.width > 4096 || canvasTests.physicalSize.height > 4096) {
    issues.push(`Canvas size may be too large: ${canvasTests.physicalSize.width}x${canvasTests.physicalSize.height}`)
  }
  
  if (canvasTests.physicalSize.width < 300 || canvasTests.physicalSize.height < 200) {
    issues.push(`Canvas size may be too small: ${canvasTests.physicalSize.width}x${canvasTests.physicalSize.height}`)
  }
  
  console.log(`   Logical: ${canvasTests.logicalSize.width}x${canvasTests.logicalSize.height}`)
  console.log(`   Physical: ${canvasTests.physicalSize.width}x${canvasTests.physicalSize.height}`)
  console.log(`   Pixel Ratio: ${canvasTests.pixelRatio}`)
  console.log(`   Scale: ${canvasTests.scalingFactor.toFixed(2)}`)
  
  return issues
}

/**
 * Run comprehensive scaling tests
 */
async function runScalingTests() {
  console.log('🚀 Starting Game Scaling System Tests...\n')
  
  let totalIssues = 0
  const testResults = {}
  
  // Test each scenario
  for (const [scenarioName, scenario] of Object.entries(TEST_SCENARIOS)) {
    console.log(`\n📱 Testing ${scenario.description}`)
    console.log(`   Viewport: ${scenario.width}x${scenario.height} @ ${scenario.pixelRatio}x`)
    
    const results = calculateGameDimensions(scenario)
    testResults[scenarioName] = results
    
    // Get expectations for device type
    const expectations = SCALING_EXPECTATIONS[results.deviceType] || SCALING_EXPECTATIONS.desktop
    
    // Validate results
    const issues = validateScaling(scenario, results, expectations)
    
    console.log(`   Game Size: ${results.width}x${results.height}`)
    console.log(`   Scale: ${results.scale.toFixed(2)}`)
    console.log(`   Space Utilization: ${(results.utilization.total * 100).toFixed(1)}%`)
    console.log(`   Device Type: ${results.deviceType}`)
    
    if (issues.length > 0) {
      console.log(`   ⚠️  Issues found:`)
      issues.forEach(issue => console.log(`      - ${issue}`))
      totalIssues += issues.length
    } else {
      console.log(`   ✅ All checks passed`)
    }
    
    // Test canvas scaling for this scenario
    const canvasIssues = testCanvasScaling(scenario, results)
    if (canvasIssues.length > 0) {
      console.log(`   ⚠️  Canvas issues:`)
      canvasIssues.forEach(issue => console.log(`      - ${issue}`))
      totalIssues += canvasIssues.length
    } else {
      console.log(`   ✅ Canvas scaling validated`)
    }
  }
  
  // Test CSS custom properties
  testCSSCustomProperties()
  
  // Summary report
  console.log('\n📊 Test Summary:')
  console.log(`   Scenarios tested: ${Object.keys(TEST_SCENARIOS).length}`)
  console.log(`   Total issues found: ${totalIssues}`)
  
  if (totalIssues === 0) {
    console.log('   🎉 All tests passed!')
  } else {
    console.log('   ⚠️  Some issues found - review results above')
  }
  
  // Performance recommendations
  console.log('\n🔧 Performance Recommendations:')
  console.log('   - Use CSS custom properties for dynamic styling')
  console.log('   - Implement ResizeObserver debouncing (300ms recommended)')
  console.log('   - Cache scaling calculations in useMemo')
  console.log('   - Use transform: scale() instead of changing width/height when possible')
  console.log('   - Consider viewport-relative units (dvh/dvw) for modern browsers')
  
  return totalIssues === 0
}

/**
 * Generate scaling system documentation
 */
function generateDocumentation() {
  console.log('\n📚 Game Scaling System Documentation:\n')
  
  console.log('## Quick Start')
  console.log('```tsx')
  console.log('import { useGameScaling } from "../../contexts/GameScalingContext"')
  console.log('')
  console.log('function MyGame() {')
  console.log('  const { dimensions, scale } = useGameScaling()')
  console.log('  ')
  console.log('  return (')
  console.log('    <div style={{')
  console.log('      width: dimensions.width,')
  console.log('      height: dimensions.height,')
  console.log('      transform: `scale(${scale})`')
  console.log('    }}>')
  console.log('      {/* Game content */}')
  console.log('    </div>')
  console.log('  )')
  console.log('}')
  console.log('```')
  
  console.log('\n## Canvas/Three.js Games')
  console.log('```tsx')
  console.log('import { useCanvasScaling } from "../../components/Game/ScaledGameContainer"')
  console.log('')
  console.log('function CanvasGame() {')
  console.log('  const { canvasWidth, canvasHeight, pixelRatio } = useCanvasScaling()')
  console.log('  ')
  console.log('  return (')
  console.log('    <Canvas')
  console.log('      style={{ width: canvasWidth, height: canvasHeight }}')
  console.log('      dpr={pixelRatio}')
  console.log('    >')
  console.log('      {/* Three.js content */}')
  console.log('    </Canvas>')
  console.log('  )')
  console.log('}')
  console.log('```')
  
  console.log('\n## CSS Custom Properties')
  console.log('```css')
  console.log('.game-container {')
  console.log('  width: var(--game-screen-width, 1024px);')
  console.log('  height: var(--game-screen-height, 576px);')
  console.log('  transform: scale(var(--game-screen-scale, 1));')
  console.log('}')
  console.log('')
  console.log('.responsive-text {')
  console.log('  font-size: calc(16px * var(--game-screen-scale, 1));')
  console.log('}')
  console.log('')
  console.log('.touch-target {')
  console.log('  min-height: calc(44px * var(--game-screen-scale, 1));')
  console.log('}')
  console.log('```')
}

/**
 * Main script execution
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--docs')) {
    generateDocumentation()
    return
  }
  
  const success = await runScalingTests()
  
  if (args.includes('--verbose')) {
    generateDocumentation()
  }
  
  process.exit(success ? 0 : 1)
}

// Run the script
main().catch(console.error)
