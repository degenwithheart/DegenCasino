import Matter from 'matter-js'

const WIDTH = 700
const HEIGHT = 700

const SIMULATIONS = 100
export const PLINKO_RAIUS = 9
export const PEG_RADIUS = 11
const RESTISTUTION = .4
const GRAVITY = 1
const SPAWN_OFFSET_RANGE = 10

export const bucketWallHeight = 60
export const bucketHeight = bucketWallHeight
export const barrierHeight = bucketWallHeight * 1.2
export const barrierWidth = 4

// Visual style constants to mirror SkyCaptainess look (pegs + bucket blocks)
const PEG_FILL = '#F5DCFF'
const BUCKET_BLOCK_SIZE = 20
const BUCKET_BLOCK_MARGIN_Y = 8

// Optional color map for bucket blocks by multiplier
const MULTIPLIER_COLORS: Record<number, string> = {
  110: '#ff003f',
  88:  '#ff1837',
  41:  '#ff302f',
  33:  '#ff4827',
  25:  '#ff6020',
  18:  '#ff7818',
  15:  '#ff9010',
  10:  '#ffa818',
  5:   '#ffc000',
  3:   '#ffc000',
  2:   '#ffa818',
  1.5: '#ff9010',
  1:   '#94a3b8',
  0.5: '#64748b',
  0.3: '#475569',
}
function bucketColorFor(multiplier: number) {
  return MULTIPLIER_COLORS[multiplier] ?? '#94a3b8'
}

interface PlinkoContactEvent {
  plinko?: Matter.Body
  peg?: Matter.Body
  bucket?: Matter.Body
  barrier?: Matter.Body
}

export interface PlinkoProps {
  multipliers: number[]
  onContact: (contact: PlinkoContactEvent) => void
  rows: number
}

interface SimulationResult {
  bucketIndex: number
  plinkoIndex: number
  path: {x:number,y:number}[]
  collisions: { frame: number, event: PlinkoContactEvent }[]
}

export class Plinko {
  width = WIDTH
  height = HEIGHT

  private engine = Matter.Engine.create({
    gravity: { y: GRAVITY },
    timing: { timeScale: 1 },
  })

  private runner = Matter.Runner.create()
  private props: PlinkoProps
  private ballComposite = Matter.Composite.create()
  private bucketComposite = Matter.Composite.create()
  private startPositions: number[]
  private replayBalls: Array<{
    ball: Matter.Body,
    path: {x:number,y:number}[],
    collisions: { frame: number, event: PlinkoContactEvent }[],
    frame: number,
    animationId: number | null
  }> = []
  private visualizePath: boolean = false

  setVisualizePath(enabled: boolean) {
    this.visualizePath = enabled
  }

  // Buckets: keep sensors/barriers for logic; add non-colliding visual blocks for style
  private makeBuckets() {
    const unique = Array.from(new Set(this.props.multipliers))
    const secondHalf = [...unique].slice(1)
    const firstHalf = [...secondHalf].reverse()
    const center = [unique[0], unique[0], unique[0]]
    const buckets = [...firstHalf, ...center, ...secondHalf]
    const numBuckets = buckets.length
    const bucketWidth = this.width / numBuckets

    // Visible but subtle barriers (collision unchanged)
    const barriers = Array.from({ length: numBuckets + 1 }).map((_, i) => {
      const x = i * bucketWidth
      return Matter.Bodies.rectangle(
        x,
        this.height - barrierHeight / 2,
        barrierWidth,
        barrierHeight,
        {
          isStatic: true,
          label: 'Barrier',
          chamfer: { radius: 2 },
          render: {
            fillStyle: 'rgba(255,255,255,0.08)',
          },
        }
      )
    })

    // Sensors remain the logic targets
    const sensors = buckets.map((bucketMultiplier, bucketIndex) => {
      const x = bucketIndex * bucketWidth + bucketWidth / 2
      return Matter.Bodies.rectangle(
        x,
        this.height - bucketHeight / 2,
        bucketWidth - barrierWidth,
        bucketHeight,
        {
          isStatic: true,
          isSensor: true,
          label: 'Bucket',
          plugin: {
            bucketIndex,
            bucketMultiplier,
          },
          render: {
            fillStyle: '#0b0014',
            strokeStyle: '#F5DCFF22',
            lineWidth: 1,
          },
        }
      )
    })

    // Add 20x20 visual blocks above sensors to mirror SkyCaptainess bucket tiles
    const visualBlocks = buckets.map((bucketMultiplier, bucketIndex) => {
      const x = bucketIndex * bucketWidth + bucketWidth / 2
      const y = this.height - bucketHeight - BUCKET_BLOCK_MARGIN_Y - BUCKET_BLOCK_SIZE / 2
      return Matter.Bodies.rectangle(
        x,
        y,
        BUCKET_BLOCK_SIZE,
        BUCKET_BLOCK_SIZE,
        {
          isStatic: true,
          isSensor: true, // purely visual
          label: `BucketBlock-${bucketMultiplier}`,
          collisionFilter: { mask: 0 }, // no collision events
          render: {
            fillStyle: bucketColorFor(bucketMultiplier),
            // To use textures instead, replace with sprite:
            // sprite: { texture: 'path/to/texture.png', xScale: 1, yScale: 1 }
          },
        }
      )
    })

    return [...sensors, ...barriers, ...visualBlocks]
  }

  private makePlinko = (offsetX: number, index: number) => {
    const x = this.width / 2 + offsetX
    const y = -10
    return Matter.Bodies.circle(x, y, PLINKO_RAIUS, {
      restitution: RESTISTUTION,
      collisionFilter: { group: -6969 },
      label: 'Plinko',
      plugin: { startPositionIndex: index },
    })
  }

  single() {
    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandler)
    Matter.Runner.stop(this.runner)
    Matter.Events.on(this.engine, 'collisionStart', this.collisionHandler)
    Matter.Composite.add(
      this.ballComposite,
      this.makePlinko(Matter.Common.random(-SPAWN_OFFSET_RANGE, SPAWN_OFFSET_RANGE), 0),
    )
    Matter.Runner.run(this.runner, this.engine)
  }

  cleanup() {
    Matter.World.clear(this.engine.world, false)
    Matter.Engine.clear(this.engine)
    // Cancel all running replay animations
    this.replayBalls.forEach(rb => {
      if (rb.animationId !== null) cancelAnimationFrame(rb.animationId)
    })
    this.replayBalls = []
  }

  private makePlinkos() {
    return this.startPositions.map(this.makePlinko)
  }

  getBodies() {
    return Matter.Composite.allBodies(this.engine.world)
  }

  constructor(props: PlinkoProps) {
    this.props = props
    this.startPositions = Array.from({ length: SIMULATIONS }).map(() => Matter.Common.random(-SPAWN_OFFSET_RANGE / 2, SPAWN_OFFSET_RANGE / 2))
    const rowSize = this.height / (this.props.rows + 2)
    const pegs = Array.from({ length: this.props.rows })
      .flatMap((_, row, jarr) => {
        const cols = (1 + row)
        const rowWidth = this.width * (row / (jarr.length - 1))
        const colSpacing = cols === 1 ? 0 : rowWidth / (cols - 1)
        return Array.from({ length: cols })
          .map((_, column, arr) => {
            const x = this.width / 2 - rowWidth / 2 + colSpacing * column
            const y = rowSize * row + rowSize / 2
            return Matter.Bodies.circle(x, y, PEG_RADIUS, {
              isStatic: true,
              label: 'Peg',
              plugin: { pegIndex: row * arr.length + column },
              render: {
                fillStyle: PEG_FILL,
                strokeStyle: '#FFFFFF22',
                lineWidth: 1,
              },
            })
          })
      }).slice(1)
    Matter.Composite.add(
      this.bucketComposite,
      this.makeBuckets(),
    )
    Matter.Composite.add(this.engine.world, [
      ...pegs,
      this.ballComposite,
      this.bucketComposite,
    ])
  }

  reset() {
    Matter.Runner.stop(this.runner)
    Matter.Composite.clear(this.ballComposite, false)
    Matter.Composite.add(this.ballComposite, this.makePlinkos())
    // Stop all replay animations
    this.replayBalls.forEach(rb => {
      if (rb.animationId !== null) cancelAnimationFrame(rb.animationId)
    })
    this.replayBalls = []
  }

  private recordContactEvent(event: Matter.IEventCollision<Matter.Engine>, frame: number, collisions: { frame: number, event: PlinkoContactEvent }[]) {
    for (const pair of event.pairs) {
      const contactEvent: PlinkoContactEvent = {}
      const assignBody = (key: keyof PlinkoContactEvent, label: string) => {
        if (pair.bodyA.label === label) contactEvent[key] = pair.bodyA
        if (pair.bodyB.label === label) contactEvent[key] = pair.bodyB
      }
      assignBody('peg', 'Peg')
      assignBody('bucket', 'Bucket')
      assignBody('barrier', 'Barrier')
      assignBody('plinko', 'Plinko')

      if (contactEvent.peg || contactEvent.bucket || contactEvent.barrier || contactEvent.plinko) {
        collisions.push({ frame, event: contactEvent })
      }
    }
  }

  simulate(desiredBucketIndex: number) {
    // Use a temporary engine and runner for simulation
    const tempEngine = Matter.Engine.create({ gravity: { y: GRAVITY }, timing: { timeScale: 1 } })
    const tempRunner = Matter.Runner.create()
    const tempBallComposite = Matter.Composite.create()
    const tempBucketComposite = Matter.Composite.create()
    const startPositions = [...this.startPositions]
    const rowSize = this.height / (this.props.rows + 2)
    const pegs = Array.from({ length: this.props.rows })
      .flatMap((_, row, jarr) => {
        const cols = (1 + row)
        const rowWidth = this.width * (row / (jarr.length - 1))
        const colSpacing = cols === 1 ? 0 : rowWidth / (cols - 1)
        return Array.from({ length: cols })
          .map((_, column, arr) => {
            const x = this.width / 2 - rowWidth / 2 + colSpacing * column
            const y = rowSize * row + rowSize / 2
            return Matter.Bodies.circle(x, y, PEG_RADIUS, {
              isStatic: true,
              label: 'Peg',
              plugin: { pegIndex: row * arr.length + column },
              render: {
                fillStyle: PEG_FILL,
                strokeStyle: '#FFFFFF22',
                lineWidth: 1,
              },
            })
          })
      }).slice(1)
    Matter.Composite.add(tempBucketComposite, this.makeBuckets())
    Matter.Composite.add(tempEngine.world, [
      ...pegs,
      tempBallComposite,
      tempBucketComposite,
    ])

    const results: Omit<SimulationResult, 'collisions'>[] = []
    const paths: {x:number,y:number}[][] = startPositions.map(() => [])
    const allCollisions: { frame: number, event: PlinkoContactEvent }[] = []

    let simFrame = 0
    const simHandler = (ev: Matter.IEventCollision<Matter.Engine>) => {
      for (const pair of ev.pairs) {
        const contactEvent: PlinkoContactEvent = {}
        const assignBody = (key: keyof PlinkoContactEvent, label: string) => {
          if (pair.bodyA.label === label) contactEvent[key] = pair.bodyA
          if (pair.bodyB.label === label) contactEvent[key] = pair.bodyB
        }
        assignBody('peg', 'Peg')
        assignBody('bucket', 'Bucket')
        assignBody('barrier', 'Barrier')
        assignBody('plinko', 'Plinko')
        if (contactEvent.peg || contactEvent.bucket || contactEvent.barrier || contactEvent.plinko) {
          allCollisions.push({ frame: simFrame, event: contactEvent })
        }
      }
    }
    Matter.Events.on(tempEngine, 'collisionStart', simHandler)
    // Add balls
    startPositions.forEach((offsetX, idx) => {
      Matter.Composite.add(tempBallComposite, Matter.Bodies.circle(
        this.width / 2 + offsetX,
        -10,
        PLINKO_RAIUS,
        {
          restitution: RESTISTUTION,
          collisionFilter: { group: -6969 },
          label: 'Plinko',
          plugin: { startPositionIndex: idx },
        }
      ))
    })
    for (let i = 0; i < 1000; i++) {
      simFrame = i
      Matter.Runner.tick(tempRunner, tempEngine, 1)
      const bodies = Matter.Composite.allBodies(tempBallComposite)
      bodies.forEach((b) => {
        if (b.label === 'Plinko') {
          const idx = (b as any).plugin.startPositionIndex
          paths[idx].push({ x: b.position.x, y: b.position.y })
        }
      })
    }
    Matter.Events.off(tempEngine, 'collisionStart', simHandler)
    Matter.Runner.stop(tempRunner)
    Matter.Composite.clear(tempBallComposite, false)

    const bucketHits: { [plinkoIndex: number]: number } = {}
    allCollisions.forEach(({frame, event}) => {
      if (event.plinko && event.bucket) {
        const plinkoIndex = (event.plinko as any).plugin.startPositionIndex
        if (bucketHits[plinkoIndex] === undefined) {
          bucketHits[plinkoIndex] = (event.bucket as any).plugin.bucketIndex
        }
      }
    })

    const finalResults = []
    for (let i=0; i<startPositions.length; i++) {
      if (bucketHits[i] !== undefined) {
        finalResults.push({
          bucketIndex: bucketHits[i],
          plinkoIndex: i,
          path: paths[i],
          collisions: allCollisions
        })
      }
    }

    return finalResults.filter(({ bucketIndex }) => bucketIndex === desiredBucketIndex)
  }

  collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
    const contactEvent: PlinkoContactEvent = {}
    for (const pair of event.pairs) {
      const assignBody = (key: keyof PlinkoContactEvent, label: string) => {
        if (pair.bodyA.label === label) contactEvent[key] = pair.bodyA
        if (pair.bodyB.label === label) contactEvent[key] = pair.bodyB
      }
      assignBody('peg', 'Peg')
      assignBody('bucket', 'Bucket')
      assignBody('barrier', 'Barrier')
      assignBody('plinko', 'Plinko')
    }
    this.props.onContact && this.props.onContact(contactEvent)
  }

  runAll() {
    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandler)
    Matter.Runner.stop(this.runner)
    Matter.Composite.clear(this.ballComposite, false)
    Matter.Events.on(this.engine, 'collisionStart', this.collisionHandler)
    Matter.Composite.add(
      this.ballComposite,
      this.makePlinkos(),
    )
    Matter.Runner.run(this.runner, this.engine)
  }

  run(desiredMultiplier: number) {
    // Do not stop the runner or clear events, just add a new ball animation
    const bucket = Matter.Common.choose(
      this.bucketComposite.bodies.filter((x) => (x as any).plugin.bucketMultiplier === desiredMultiplier),
    )
    const candidates = this.simulate((bucket as any).plugin.bucketIndex)
    if (!candidates.length) {
      console.error('Failed to simulate desired outcome for multiplier', desiredMultiplier)
      // Optionally show user feedback here, or skip animation
      return;
    }

    const chosen = Matter.Common.choose(candidates)

    if (this.visualizePath) {
      console.log("Chosen path:", chosen.path)
    }

    const chosenIndex = chosen.plinkoIndex
    const chosenCollisions = chosen.collisions.filter(({event}) => {
      return event.plinko && (event.plinko as any).plugin.startPositionIndex === chosenIndex
    })

    const ball = this.makePlinko(this.startPositions[chosenIndex], chosenIndex)
    Matter.Composite.add(this.ballComposite, ball)

    this.replayBalls.push({
      ball,
      path: chosen.path,
      collisions: chosenCollisions,
      frame: 0,
      animationId: null
    })

    this.startReplayAnimation(this.replayBalls[this.replayBalls.length - 1])
  }

  private startReplayAnimation(replayBallObj: {
    ball: Matter.Body,
    path: {x:number,y:number}[],
    collisions: { frame: number, event: PlinkoContactEvent }[],
    frame: number,
    animationId: number | null
  }) {
    const animate = () => {
      if (!replayBallObj.path || !replayBallObj.ball) return
      if (replayBallObj.frame >= replayBallObj.path.length) {
        return
      }
      const pos = replayBallObj.path[replayBallObj.frame]
      Matter.Body.setPosition(replayBallObj.ball, { x: pos.x, y: pos.y })

      const frameCollisions = replayBallObj.collisions.filter(c => c.frame === replayBallObj.frame)
      frameCollisions.forEach(({event}) => {
        this.props.onContact(event)
      })

      replayBallObj.frame++
      replayBallObj.animationId = requestAnimationFrame(animate)
    }
    replayBallObj.animationId = requestAnimationFrame(animate)
  }
}