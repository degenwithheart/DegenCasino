import Matter from "matter-js";

const WIDTH = 700;
const HEIGHT = 700;
const SIMULATIONS = 50;

export const PLINKO_RAIUS = 9;
export const PEG_RADIUS = 11;
const RESTITUTION = 0.4;
const GRAVITY = 1;
const SPAWN_OFFSET_RANGE = 10;

export const bucketWallHeight = 60;
export const bucketHeight = bucketWallHeight;
export const barrierHeight = bucketWallHeight * 1.2;
export const barrierWidth = 4;

interface PlinkoContactEvent {
  plinko?: Matter.Body;
  peg?: Matter.Body;
  bucket?: Matter.Body;
  barrier?: Matter.Body;
}

export interface PlinkoProps {
  multipliers: number[];
  onContact: (contact: PlinkoContactEvent) => void;
  rows: number;
}

interface SimulationResult {
  bucketIndex: number;
  plinkoIndex: number;
  path: Float32Array;                                      // dense [x0,y0,x1,y1…]
  collisions: { frame: number; event: PlinkoContactEvent }[];
}

export class Plinko {
  width = WIDTH;
  height = HEIGHT;

  private engine = Matter.Engine.create({
    gravity: { y: GRAVITY },
    timing: { timeScale: 1 },
  });

  // keep isFixed:true so tick(engine,1) is deterministic
  private runner = Matter.Runner.create({ isFixed: true });

  private props: PlinkoProps;
  private ballComposite = Matter.Composite.create();
  private bucketComposite = Matter.Composite.create();
  private startPositions: number[];
  private animationId: number | null = null;
  private visualizePath = false;

  // public list of currently animating balls
  public activeBalls: {
    path: Float32Array;
    frame: number;
    collisions: { frame: number; event: PlinkoContactEvent }[];
    ball: Matter.Body;
    done: boolean;
  }[] = [];

  setVisualizePath(on: boolean) {
    this.visualizePath = on;
  }

  constructor(props: PlinkoProps) {
    this.props = props;
    // pre-compute 50 random X-offsets in ±5px
    this.startPositions = Array.from({ length: SIMULATIONS }).map(() =>
      Matter.Common.random(-SPAWN_OFFSET_RANGE / 2, SPAWN_OFFSET_RANGE / 2)
    );

    // build board (pegs + buckets) in the live engine
    const pegs = this.buildPegs();
    Matter.Composite.add(this.bucketComposite, this.makeBuckets());
    Matter.Composite.add(this.engine.world, [
      ...pegs,
      this.ballComposite,
      this.bucketComposite,
    ]);
  }

  private buildPegs() {
    const rowSize = this.height / (this.props.rows + 2);
    const pegs = Array.from({ length: this.props.rows })
      .flatMap((_, row, all) => {
        const cols = row + 1;
        const rowW = (this.width * row) / (all.length - 1);
        const spacing = cols === 1 ? 0 : rowW / (cols - 1);
        return Array.from({ length: cols }).map((_, col) => {
          const x = this.width / 2 - rowW / 2 + spacing * col;
          const y = rowSize * row + rowSize / 2;
          return Matter.Bodies.circle(x, y, PEG_RADIUS, {
            isStatic: true,
            label: "Peg",
            plugin: { pegIndex: row * cols + col },
          });
        });
      })
      .slice(1);
    return pegs;
  }

  private makeBuckets() {
    const unique = Array.from(new Set(this.props.multipliers));
    const secondHalf = unique.slice(1);
    const firstHalf = [...secondHalf].reverse();
    const center = [unique[0], unique[0], unique[0]];
    const layout = [...firstHalf, ...center, ...secondHalf];
    const w = this.width / layout.length;

    const barriers = Array.from({ length: layout.length + 1 }).map((_, i) =>
      Matter.Bodies.rectangle(i * w, this.height - barrierHeight / 2, barrierWidth, barrierHeight, {
        isStatic: true,
        label: "Barrier",
        chamfer: { radius: 2 },
      })
    );

    const sensors = layout.map((m, idx) =>
      Matter.Bodies.rectangle(
        idx * w + w / 2,
        this.height - bucketHeight / 2,
        w - barrierWidth,
        bucketHeight,
        {
          isStatic: true,
          isSensor: true,
          label: "Bucket",
          plugin: { bucketIndex: idx, bucketMultiplier: m },
        }
      )
    );

    return [...sensors, ...barriers];
  }

  private makePlinko = (offsetX: number, index: number) =>
    Matter.Bodies.circle(this.width / 2 + offsetX, -10, PLINKO_RAIUS, {
      restitution: RESTITUTION,
      collisionFilter: { group: -6969 },
      label: "Plinko",
      plugin: { startPositionIndex: index },
    });

  getBodies() {
    return Matter.Composite.allBodies(this.engine.world);
  }

  single() {
    Matter.Events.off(this.engine, "collisionStart", this.collisionHandler);
    Matter.Runner.stop(this.runner);
    Matter.Events.on(this.engine, "collisionStart", this.collisionHandler);
    Matter.Composite.add(
      this.ballComposite,
      this.makePlinko(Matter.Common.random(-SPAWN_OFFSET_RANGE, SPAWN_OFFSET_RANGE), 0)
    );
    Matter.Runner.run(this.runner, this.engine);
  }

  cleanup() {
    Matter.World.clear(this.engine.world, false);
    Matter.Engine.clear(this.engine);
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.activeBalls = [];
  }

  /** Clears *only* simulated balls (not pegs/buckets). Keep for dev usage. */
  reset() {
    Matter.Runner.stop(this.runner);
    Matter.Composite.clear(this.ballComposite, false);
    this.activeBalls = [];
  }

  /** Run an isolated simulation on a temporary engine to find a path
   * for a ball that lands in the desired bucket. This will not affect
   * the live board or existing animated balls. */
  private simulate(desiredBucketIndex: number): SimulationResult | null {
    // temp engine & runner
    const simEngine = Matter.Engine.create({
      gravity: { y: GRAVITY },
      timing: { timeScale: 1 },
    });
    const simRunner = Matter.Runner.create({ isFixed: true });

    // temp composites
    const simBallComposite = Matter.Composite.create();
    const simBucketComposite = Matter.Composite.create();

    // build pegs & buckets for the sim world (same metadata)
    const simPegs = this.buildPegs();
    Matter.Composite.add(simBucketComposite, this.makeBuckets());
    Matter.Composite.add(simEngine.world, [
      ...simPegs,
      simBallComposite,
      simBucketComposite,
    ]);

    // spawn all candidate start positions
    const spawn = (offsetX: number, index: number) =>
      Matter.Bodies.circle(this.width / 2 + offsetX, -10, PLINKO_RAIUS, {
        restitution: RESTITUTION,
        collisionFilter: { group: -6969 },
        label: "Plinko",
        plugin: { startPositionIndex: index },
      });

    Matter.Composite.add(
      simBallComposite,
      this.startPositions.map(spawn)
    );

    // helpers
    const paths: number[][] = this.startPositions.map(() => []);
    const allCollisions: { frame: number; event: PlinkoContactEvent }[] = [];
    let chosenIndex: number | null = null;
    let frame = 0;

    const recordContactEvent = (
      ev: Matter.IEventCollision<Matter.Engine>,
      f: number,
      list: { frame: number; event: PlinkoContactEvent }[],
      onlyForPlinko?: number
    ) => {
      for (const p of ev.pairs) {
        const evt: PlinkoContactEvent = {};
        const tag = (k: keyof PlinkoContactEvent, lbl: string) => {
          if (p.bodyA.label === lbl) evt[k] = p.bodyA;
          if (p.bodyB.label === lbl) evt[k] = p.bodyB;
        };
        tag("peg", "Peg");
        tag("barrier", "Barrier");
        tag("bucket", "Bucket");
        tag("plinko", "Plinko");

        if (
          evt.plinko &&
          (onlyForPlinko === undefined ||
            evt.plinko.plugin.startPositionIndex === onlyForPlinko)
        ) {
          list.push({ frame: f, event: evt });
        }
      }
    };

    const simHandler = (ev: Matter.IEventCollision<Matter.Engine>) => {
      recordContactEvent(ev, frame, allCollisions);
      for (const p of ev.pairs) {
        const A = p.bodyA, B = p.bodyB;
        if (
          (A.label === "Plinko" && B.label === "Bucket" && B.plugin.bucketIndex === desiredBucketIndex) ||
          (B.label === "Plinko" && A.label === "Bucket" && A.plugin.bucketIndex === desiredBucketIndex)
        ) {
          chosenIndex = (A.label === "Plinko" ? A : B).plugin.startPositionIndex;
          break;
        }
      }
    };

    Matter.Events.on(simEngine, "collisionStart", simHandler);

    for (frame = 0; frame < 1000; frame++) {
      Matter.Runner.tick(simRunner, simEngine, 1);
      for (const b of simBallComposite.bodies) {
        if (b.label === "Plinko") {
          const idx = b.plugin.startPositionIndex;
          paths[idx].push(b.position.x, b.position.y);
        }
      }
      if (chosenIndex !== null) {
        const winBall = simBallComposite.bodies.find(
          (b) => b.plugin.startPositionIndex === chosenIndex
        )!;
        if (winBall.position.y > this.height) {
          frame++;
          break;
        }
      }
    }

    Matter.Events.off(simEngine, "collisionStart", simHandler);

    if (chosenIndex === null) {
      Matter.Engine.clear(simEngine);
      return null;
    }

    const winnerPath = new Float32Array(paths[chosenIndex]);
    const winnerCollisions = allCollisions.filter(
      (c) => c.event.plinko?.plugin.startPositionIndex === chosenIndex
    );

    Matter.Engine.clear(simEngine);

    return {
      bucketIndex: desiredBucketIndex,
      plinkoIndex: chosenIndex,
      path: winnerPath,
      collisions: winnerCollisions,
    };
  }

  /** Choose a bucket matching the given multiplier and enqueue a new replayed ball. */
  run(desiredMultiplier: number) {
    // pick a bucket with matching multiplier from the *live* bucketComposite
    const bucket = Matter.Common.choose(
      this.bucketComposite.bodies.filter(
        (b) => b.label === "Bucket" && b.plugin.bucketMultiplier === desiredMultiplier
      )
    );
    if (!bucket) throw new Error("No bucket matches desired multiplier");

    const sim = this.simulate(bucket.plugin.bucketIndex);
    if (!sim) throw new Error("Failed to simulate desired outcome");

    if (this.visualizePath) {
      console.log("Simulation frames:", sim.path.length / 2);
    }

    // spawn the live ball at the same start offset
    const liveBall = this.makePlinko(
      this.startPositions[sim.plinkoIndex],
      sim.plinkoIndex
    );
    Matter.Composite.add(this.ballComposite, liveBall);

    // track this replay
    this.activeBalls.push({
      path: sim.path,
      frame: 0,
      collisions: sim.collisions,
      ball: liveBall,
      done: false,
    });

    // ensure anim loop is running
    this.startReplayAnimation();
  }

  /** Single RAF loop that advances *all* active replays until all are done. */
  private startReplayAnimation() {
    if (this.animationId !== null) return; // already running

    const step = () => {
      if (this.activeBalls.length === 0) {
        this.animationId = null;
        return;
      }

      // advance all active balls
      for (const replay of this.activeBalls) {
        if (replay.done) continue;
        const totalFrames = replay.path.length / 2;
        if (replay.frame >= totalFrames) {
          replay.done = true;
          continue;
        }

        const x = replay.path[replay.frame * 2];
        const y = replay.path[replay.frame * 2 + 1];
        Matter.Body.setPosition(replay.ball, { x, y });

        // fire collisions for this frame (swap plinko to live ball)
        replay.collisions
          .filter((c) => c.frame === replay.frame)
          .forEach(({ event }) => {
            const e: PlinkoContactEvent = {
              ...event,
              plinko: replay.ball,
            };
            this.props.onContact(e);
          });

        replay.frame++;
      }

      // remove finished balls from list & from composite
      const stillActive: typeof this.activeBalls = [];
      for (const r of this.activeBalls) {
        if (r.done) {
          Matter.Composite.remove(this.ballComposite, r.ball);
        } else {
          stillActive.push(r);
        }
      }
      this.activeBalls = stillActive;

      this.animationId = requestAnimationFrame(step);
    };

    this.animationId = requestAnimationFrame(step);
  }

  /** Legacy live-physics visualizer helpers (untouched) */
  collisionHandler = (ev: Matter.IEventCollision<Matter.Engine>) => {
    const evt: PlinkoContactEvent = {};
    for (const p of ev.pairs) {
      const tag = (k: keyof PlinkoContactEvent, lbl: string) => {
        if (p.bodyA.label === lbl) evt[k] = p.bodyA;
        if (p.bodyB.label === lbl) evt[k] = p.bodyB;
      };
      tag("peg", "Peg");
      tag("barrier", "Barrier");
      tag("bucket", "Bucket");
      tag("plinko", "Plinko");
    }
    this.props.onContact(evt);
  };

  runAll() {
    Matter.Events.off(this.engine, "collisionStart", this.collisionHandler);
    Matter.Runner.stop(this.runner);
    Matter.Composite.clear(this.ballComposite, false);
    Matter.Events.on(this.engine, "collisionStart", this.collisionHandler);
    Matter.Composite.add(
      this.ballComposite,
      this.startPositions.map(this.makePlinko)
    );
    Matter.Runner.run(this.runner, this.engine);
  }
}
