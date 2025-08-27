// Binomial Plinko engine for simple left/right decision tree logic
export interface BinomialPath {
  path: number[]; // 0 = left, 1 = right for each row
  bucketIndex: number; // final bucket the ball lands in
}

/**
 * Generate a binomial path through the Plinko board
 * @param rows Number of rows of pegs
 * @returns Array where each element is 0 (left) or 1 (right)
 */
export function generateBinomialPath(rows: number): number[] {
  const path: number[] = [];
  for (let i = 0; i < rows; i++) {
    path.push(Math.random() < 0.5 ? 0 : 1); // 0 = left, 1 = right
  }
  return path;
}

/**
 * Calculate which bucket a ball lands in based on its binomial path
 * @param path Array of left/right decisions (0/1)
 * @param bucketCount Total number of buckets
 * @returns Bucket index (0 to bucketCount-1)
 */
export function getBinomialBucketIndex(path: number[], bucketCount: number): number {
  // Count the number of right moves
  const rightMoves = path.reduce((sum, move) => sum + move, 0);
  
  // Map the rightMoves to a bucket index
  // With n rows, we can have 0 to n right moves
  // We need to map this to 0 to bucketCount-1
  const maxRightMoves = path.length;
  const bucketIndex = Math.floor((rightMoves / maxRightMoves) * bucketCount);
  
  // Ensure we don't exceed bucket bounds
  return Math.min(bucketIndex, bucketCount - 1);
}

/**
 * Calculate the position of a ball at each step of its binomial path
 * @param path Array of left/right decisions
 * @param boardWidth Width of the Plinko board
 * @param boardHeight Height of the Plinko board
 * @returns Array of {x, y} positions for animation
 */
export function calculateBinomialPositions(
  path: number[], 
  boardWidth: number, 
  boardHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const rows = path.length;
  const rowHeight = boardHeight / (rows + 2); // +2 for start and bucket areas
  
  // Starting position (center top)
  let currentX = boardWidth / 2;
  positions.push({ x: currentX, y: rowHeight / 2 });
  
  // Calculate position for each row
  for (let row = 0; row < rows; row++) {
    const y = rowHeight * (row + 1) + rowHeight / 2;
    
    // Each row has (row + 1) pegs, so spacing gets wider
    const rowWidth = (boardWidth * row) / (rows - 1);
    const pegSpacing = row === 0 ? 0 : rowWidth / row;
    
    // Move left or right based on path decision
    if (path[row] === 0) {
      // Move left
      currentX -= pegSpacing / 2;
    } else {
      // Move right
      currentX += pegSpacing / 2;
    }
    
    positions.push({ x: currentX, y });
  }
  
  // Final position in bucket
  positions.push({ x: currentX, y: boardHeight - rowHeight / 2 });
  
  return positions;
}

/**
 * Generate a complete binomial result for the target bucket
 * @param rows Number of rows
 * @param bucketCount Number of buckets
 * @param targetBucket Which bucket to aim for (for simulation)
 * @returns Complete binomial path and result
 */
export function generateBinomialResult(
  rows: number, 
  bucketCount: number, 
  targetBucket?: number
): BinomialPath {
  if (targetBucket !== undefined) {
    // Generate a path that lands in the target bucket
    // This is for when we need to match a specific multiplier from the game result
    return generateTargetedBinomialPath(rows, bucketCount, targetBucket);
  }
  
  // Generate a random path
  const path = generateBinomialPath(rows);
  const bucketIndex = getBinomialBucketIndex(path, bucketCount);
  
  return { path, bucketIndex };
}

/**
 * Generate a binomial path that targets a specific bucket
 * @param rows Number of rows
 * @param bucketCount Number of buckets
 * @param targetBucket Target bucket index
 * @returns Binomial path that should land in the target bucket
 */
function generateTargetedBinomialPath(
  rows: number, 
  bucketCount: number, 
  targetBucket: number
): BinomialPath {
  // Calculate how many right moves we need to reach the target bucket
  const targetRightMoves = Math.round((targetBucket / (bucketCount - 1)) * rows);
  
  // Generate a path with approximately the right number of right moves
  const path: number[] = [];
  let rightMovesRemaining = targetRightMoves;
  let rowsRemaining = rows;
  
  for (let i = 0; i < rows; i++) {
    rowsRemaining--;
    
    // Decide whether to go right based on how many right moves we still need
    if (rightMovesRemaining > 0 && (rightMovesRemaining >= rowsRemaining || Math.random() < 0.5)) {
      path.push(1); // Go right
      rightMovesRemaining--;
    } else {
      path.push(0); // Go left
    }
  }
  
  const actualBucket = getBinomialBucketIndex(path, bucketCount);
  
  return { path, bucketIndex: actualBucket };
}

/**
 * Create a smooth interpolated position for animation
 * @param positions Array of target positions
 * @param progress Animation progress (0 to 1)
 * @returns Current interpolated position
 */
export function interpolateBinomialPosition(
  positions: { x: number; y: number }[], 
  progress: number
): { x: number; y: number } {
  if (progress <= 0) return positions[0];
  if (progress >= 1) return positions[positions.length - 1];
  
  const segmentLength = 1 / (positions.length - 1);
  const segmentIndex = Math.floor(progress / segmentLength);
  const segmentProgress = (progress % segmentLength) / segmentLength;
  
  if (segmentIndex >= positions.length - 1) {
    return positions[positions.length - 1];
  }
  
  const start = positions[segmentIndex];
  const end = positions[segmentIndex + 1];
  
  return {
    x: start.x + (end.x - start.x) * segmentProgress,
    y: start.y + (end.y - start.y) * segmentProgress
  };
}
